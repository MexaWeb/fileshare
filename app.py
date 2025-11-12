from flask import Flask
from flask import render_template
from flask import request, redirect, send_from_directory
import json
import uuid
import os
from werkzeug.utils import secure_filename
import time
import threading
import mimetypes




DEFAULT_EXPIRATION_SECONDS = 3600*12 # 12 hours
MAX_FILE_SIZE_MB = 500


if not os.path.exists('./storage/'):
    os.makedirs('./storage/')
if not os.path.exists('./storage/files/'):
    os.makedirs('./storage/files/')
if not os.path.exists('./storage/filenames.json'):
    json.dump({}, open('./storage/filenames.json', 'w'))

app = Flask(__name__, template_folder='static', static_folder='static')
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE_MB * 1024 * 1024



def cleanup():
    while True:
        time.sleep(10)
        filenames = json.load(open('./storage/filenames.json', 'r'))
        current_time = time.time()
        to_delete = []
        for file_uuid, (expiration_time, original_name) in filenames.items():
            if current_time > expiration_time:
                to_delete.append(file_uuid)
        
        for file_uuid in to_delete:
            try:
                os.remove(os.path.join('./storage/files/', file_uuid))
                del filenames[file_uuid]
                print(f"deleted file {file_uuid}")
            except Exception as e:
                print(f"error deleting file {file_uuid}: {e}")
        
        json.dump(filenames, open('./storage/filenames.json', 'w'))

threading.Thread(target=cleanup, daemon=True).start()

def generate_filename():
    file_uuid = str(uuid.uuid4())
    filename = file_uuid
    return filename


def save_file():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        return 'No selected file'


    with open("./storage/filenames.json", "r+") as f:
        content = f.read()
        if content == "":
            f.write("{}")

    ext = os.path.splitext(secure_filename(file.filename))[1]
    filename = generate_filename()


    while filename in os.listdir('./storage/files/'): # avoids name collisions (astronomically low chance but still possible)
        filename = generate_filename()

    filepath = os.path.join('./storage/files/', filename)
    file.save(filepath)
    

    filenames = json.load(open('./storage/filenames.json', 'r'))
    filenames[filename] = [time.time()+DEFAULT_EXPIRATION_SECONDS, file.filename]
    json.dump(filenames, open('./storage/filenames.json', 'w'))
    print(f"saved file {file.filename} as {filename}")
    return filename






@app.route('/')
def index():
    return render_template('index.html')



@app.route('/view/<uuid:file_uuid>')
def view_file(file_uuid):
    files = json.load(open('./storage/filenames.json', 'r'))
    file_uuid = str(file_uuid)

    filename = files.get(file_uuid)[1]

    if mimetypes.guess_type(filename)[0].startswith("image/"):
        return render_template('viewfile.html', img='/api/getfile/' + str(file_uuid))
    elif mimetypes.guess_type(filename)[0].startswith("video/"):
        return render_template('viewfile.html', video='/api/getfile/' + str(file_uuid))

    return render_template('viewfile.html')




@app.route('/api/upload', methods=['POST'])
def api_upload():
    file_uuid = save_file()
    
    if file_uuid in ['No file part', 'No selected file']:
        return file_uuid, 400
    
    return redirect(f'/view/{file_uuid}')



@app.route('/api/getfile/<uuid:file_uuid>', methods=['GET'])
def api_get_file(file_uuid):
    files = json.load(open('./storage/filenames.json', 'r'))

    file_uuid = str(file_uuid)

    if os.path.isfile('./storage/files/' + file_uuid) == False:
        return "File not found", 404
    

    expiration_time = files.get(file_uuid)[0]
    filename = files.get(file_uuid)[1]

    return send_from_directory('./storage/files/', file_uuid, download_name=filename)

@app.route('/api/getfileinfo/<uuid:file_uuid>', methods=['GET'])
def api_get_file_info(file_uuid):
    files = json.load(open('./storage/filenames.json', 'r'))
    file_uuid = str(file_uuid)

    expiration_time = files.get(file_uuid)[0]
    filename = files.get(file_uuid)[1]
    return {
        "expires_at": expiration_time,
        "file_uuid": file_uuid,
        "file_type": mimetypes.guess_type(filename)[0] or "application/octet-stream",
        "original_filename": filename
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=False)
