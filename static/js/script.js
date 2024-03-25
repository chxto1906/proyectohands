
    const video = document.getElementById('videoF');
    // const socket = io();

    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //     navigator.mediaDevices.getUserMedia({ video: true })
    //         .then(function(stream) {
    //             video.srcObject = stream;
    //             video.play();
    //             //setInterval(captureAndSend, 1500); // Iniciar la captura y envío de imágenes
    //         })
    //         .catch(function(err) {
    //             console.error('Error accessing webcam: ', err);
    //         });
    // }

    // function captureAndSend() {
    //     const canvas = document.createElement('canvas');
    //     const ctx = canvas.getContext('2d');
    //     const scaleFactor = 0.4; // Factor de escala para reducir las dimensiones de la imagen
    //     const targetWidth = video.videoWidth * scaleFactor;
    //     const targetHeight = video.videoHeight * scaleFactor;
    //     canvas.width = targetWidth;
    //     canvas.height = targetHeight;
    //     ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    //     const imageData = canvas.toDataURL('image/jpeg', 0.6); // Reducir calidad al 80%
    //     console.log('Enviando imagen al servidor...', imageData);
    //     socket.emit('image', imageData);
    // };

    // function enviar() {
    //     captureAndSend()
    // }

    // socket.on('frame', function(base64) {
    //     if (base64) { // Verificar si el base64 no es nulo ni indefinido
    //         const imgSocket = document.getElementById('imgsocket')
    //         imgSocket.src = 'data:image/jpeg;base64,' + base64
    //     }
    // });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                // Conecta al servidor WebRTC
                const configuration = {
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                };
                const peerConnection = new RTCPeerConnection(configuration);
                stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
                // Envía el flujo de video al servidor
                peerConnection.createOffer().then(offer => peerConnection.setLocalDescription(offer))
                    .then(() => {
                        // Enviar la descripción de la oferta al servidor
                        const offer = peerConnection.localDescription;
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', '/offer', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({ offer }));
                    });
            })
            .catch(function(err) {
                console.error('Error accessing webcam: ', err);
            });
    }
