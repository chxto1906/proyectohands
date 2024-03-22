self.onmessage = function(event) {
    const stream = event.data;
    startVideoProcessing(stream);
  };
  
  function startVideoProcessing(stream) {
    // Obtener el track de video del stream
    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);
  
    // Procesar frames de video
    setInterval(function() {
      // Capturar frame de video
      imageCapture.grabFrame()
        .then(function(imageBitmap) {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
          context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
          
          // Convertir el frame a una imagen (por ejemplo, JPEG)
          const imageDataURL = canvas.toDataURL('image/jpeg');
  
          // Enviar el frame procesado al hilo principal
          self.postMessage(imageDataURL);
        })
        .catch(function(error) {
          console.error('Error al capturar frame:', error);
        });
    }, 1000); // Enviar un frame cada segundo (ajusta según tus necesidades)
  }