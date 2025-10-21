const form = document.getElementById('uploadForm');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', e => {
    e.preventDefault();
    submitButton.disabled = true;


    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload', true);


    progressBar.style.width = '0%';

    xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = percent + '%';
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log('upload complete!');
            window.location.href = xhr.responseURL;
        } else {
            console.log('error uploading file.');
        }
    };

    xhr.onerror = () => {
        console.log('upload failed.');
    };

    xhr.send(formData);
});