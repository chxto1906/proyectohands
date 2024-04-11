
    const video = document.getElementById('videoF');
    const socket = io();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                setInterval(captureAndSend, 800); // Iniciar la captura y envío de imágenes
            })
            .catch(function(err) {
                console.error('Error accessing webcam: ', err);
            });
    }

    function captureAndSend() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scaleFactor = 1; // Factor de escala para reducir las dimensiones de la imagen
        const targetWidth = video.videoWidth * scaleFactor;
        const targetHeight = video.videoHeight * scaleFactor;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        const imageData = canvas.toDataURL('image/jpeg', 1); // Reducir calidad al 80%
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
