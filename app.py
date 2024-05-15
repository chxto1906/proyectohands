
import eventlet
eventlet.monkey_patch()
from flask import Flask, render_template
import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
import base64
from flask_socketio import SocketIO

app = Flask(__name__)
CAP = None
DETECTOR = None
CLASSIFIER = None

socketio = SocketIO(app)

def generate_frames_img():
    """
    Funcion que genera imagen en base a la imagen capturada por la camara
    Returns:
        generator: Un generador que produce fotogramas de la imagen.
    """
    global CAP
    try:
        CAP = cv2.VideoCapture('imagen.jpg')
    except Exception as e:
        print('eeeeee',e)
    global DETECTOR
    DETECTOR = HandDetector(maxHands=1)
    global CLASSIFIER
    if CLASSIFIER is None:
        CLASSIFIER = Classifier("Model/keras_model.h5", "Model/labels.txt")
    offset = 20
    imgSize = 300
    labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
              "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    success, img = CAP.read()
    if img is not None:
        imgOutput = img.copy()
        hands, img = DETECTOR.findHands(img)
        if hands:
            hand = hands[0]
            
            x, y, w, h = hand['bbox']
            imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
            imgCrop = img[y - offset:y + h + offset, x - offset:x + w + offset]
            if imgCrop is not None:
                if imgCrop.size != 0:
                    aspectRatio = h / w
                else:
                    aspectRatio = 0
                imgCropShape = imgCrop.shape
                if aspectRatio > 1:
                    k = imgSize / h
                    wCal = math.ceil(k * w)
                    if imgCrop.size != 0:
                        imgResize = cv2.resize(imgCrop, (wCal, imgSize))
                        imgResizeShape = imgResize.shape
                        wGap = math.ceil((imgSize - wCal) / 2)
                        imgWhite[:, wGap:wCal + wGap] = imgResize
                        prediction, index = CLASSIFIER.getPrediction(imgWhite, draw=False)
                else:
                    k = imgSize / w
                    hCal = math.ceil(k * h)
                    if imgCrop.size != 0:
                        imgResize = cv2.resize(imgCrop, (imgSize, hCal))
                        imgResizeShape = imgResize.shape
                        hGap = math.ceil((imgSize - hCal) / 2)
                        imgWhite[hGap:hCal + hGap, :] = imgResize
                        prediction, index = CLASSIFIER.getPrediction(imgWhite, draw=False)
                cv2.rectangle(imgOutput, (x - offset, y - offset-50),
                            (x - offset+90, y - offset-50+50), (255, 0, 255), cv2.FILLED)
                cv2.putText(imgOutput, labels[index], (x, y -26),
                            cv2.FONT_HERSHEY_COMPLEX, 1.7, (255, 255, 255), 2)
                cv2.rectangle(imgOutput, (x-offset, y-offset),
                            (x + w+offset, y + h+offset), (255, 0, 255), 4)
                ret, buffer = cv2.imencode('.jpg', imgOutput)
                imgOutput = buffer.tobytes()
                img_base64 = base64.b64encode(imgOutput).decode('utf-8')
                return img_base64
        else:
            ret, buffer = cv2.imencode('.jpg', imgOutput)
            imgOutput = buffer.tobytes()
            img_base64 = base64.b64encode(imgOutput).decode('utf-8')
            return img_base64
def convert_frames_to_base64(generator):
    base64_frames = []
    # Itera sobre el generador y convierte cada imagen en Base64
    for frame in generator:
        # Aquí asumo que 'frame' es una imagen en formato numpy array
        # Convierte la imagen a formato de bytes
        _, buffer = cv2.imencode('.jpg', frame)
        # Convierte la imagen a una cadena Base64
        base64_image = base64.b64encode(buffer).decode('utf-8')
        # Agrega la imagen Base64 a la lista
        base64_frames.append(base64_image)
    return base64_frames

@app.route('/')
def index():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('index.html')

@app.route('/acercade')
def acercade():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('AcercDnos.html')

@app.route('/aprende')
def aprende():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('Aprende.html')

@app.route('/juegos')
def juegos():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('ExplicacionJuegos.html')

@app.route('/juegos/ahorcado')
def juegoahorcado():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('Ahorcado.html')

@app.route('/juegos/ahorcado/felicidades')
def juegoahorcadofelicidades():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('AhorFelicita.html')

@app.route('/juegos/memorama')
def juegomemorama():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('Memorama.html')

@app.route('/juegos/memorama/felicidades')
def juegomemoramafelicidades():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('MemorFelicita.html')

@app.route('/juegos/sopaletras')
def juegosopaletras():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('SopLetr.html')

@app.route('/juegos/sopaletras/felicidades')
def juegsopletfelicidades():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('SopLetFelicita.html')

@app.route('/juegos/ordenapalabras')
def juegoordenapalabras():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('OrdenarLetr.html')

@app.route('/juegos/ordenapalabras/felicidades')
def juegordenfelicidades():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('OrdenaFelicita.html')

@app.route('/contactanos')
def contactanos():
    global CAP
    if CAP != None:
        CAP = None
    return render_template('Contactanos.html')

#@app.route('/video_feed')
#def video_feed():
#    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@socketio.on('image')
def handle_image(string_base64):
    try:
        encoded_data = string_base64.split(',')[1]
        image_data = base64.b64decode(encoded_data)
        with open("imagen.jpg", "wb") as f:
            f.write(image_data)
        frame_generator = generate_frames_img()
        if frame_generator is not None:
            print('Enviando fotogramas...')
            socketio.emit('frame', frame_generator)
    except Exception as e:
        print("Error:", e)
if __name__ == "__main__":
    app.run(debug=True)
