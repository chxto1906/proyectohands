document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('videoF');
    const socket = io();

    console.log('ingresa')

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                //captureAndSend()
            })
            .catch(function(err) {
                console.error('Error accessing webcam: ', err);
            });
    }

    function captureAndSend() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');

        socket.emit('image', imageData);
    };

    setInterval(captureAndSend, 500);

    

    socket.on('frame', function(base64) {
        console.log('base64',base64)
        if (base64 !== null){
            console.log('base')
            const imgSocket = document.getElementById('imgsocket')
            imgSocket.src = 'data:image/jpeg;base64,'+base64
        }
        
    })

});
