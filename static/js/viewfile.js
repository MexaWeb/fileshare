const path = window.location.pathname;
const uuid = path.substring(path.lastIndexOf('/') + 1);


let filenameElement = document.getElementById('filename');
let expiresAt
let fileUUID
let originalFilename
fetch('/api/getfileinfo/' + uuid)
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        expiresAt = data.expires_at
        fileUUID = data.file_uuid
        originalFilename = data.original_filename
        filenameElement.textContent = originalFilename;
        if (data.file_type.startsWith('image/')) {
            let img = document.getElementById('image');
            img.src = `/api/getfile/${fileUUID}`;
            img.style.display = 'block';
        }
        else if (data.file_type.startsWith('video/')) {
            let video = document.getElementById('videoplayer');
            video.src = `/api/getfile/${fileUUID}`;
            video.style.display = 'block';
        }
        else if (data.file_type.startsWith('audio/')) {
            let audio = document.getElementById('audioplayer');
            audio.src = `/api/getfile/${fileUUID}`;
            audio.style.display = 'block';
        }
        document.querySelector('.download-button').href = `/api/getfile/${fileUUID}`;
    })
    .catch(error => {
        console.error('GET error:', error);
    });



function copydownloadlink() {
    link = new URL(`/api/getfile/${fileUUID}`, window.location.origin).href;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
}