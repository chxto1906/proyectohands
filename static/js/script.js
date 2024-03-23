
    const video = document.getElementById('videoF');
    const socket = io();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                setInterval(captureAndSend, 100); // Iniciar la captura y envío de imágenes
            })
            .catch(function(err) {
                console.error('Error accessing webcam: ', err);
            });
    }

    function captureAndSend() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        socket.emit('image', imageData);
    };

    function enviar() {
        captureAndSend()
    }

    socket.on('frame', function(base64) {
        if (base64) { // Verificar si el base64 no es nulo ni indefinido
            const imgSocket = document.getElementById('imgsocket')
            imgSocket.src = 'data:image/jpeg;base64,' + base64
        }
    });
