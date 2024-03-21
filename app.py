from flask import Flask, render_template, Response
import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math

app = Flask(__name__)
cap = None
detector = None
classifier = None

def generate_frames():
    global cap
    if (cap == None):
        cap = cv2.VideoCapture(-1)
    
    global detector
    if (detector == None):
        detector = HandDetector(maxHands=1)
        
    global classifier
    if (classifier == None):
        classifier = Classifier("Model/keras_model.h5", "Model/labels.txt")

    offset = 20
    imgSize = 300
    labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    while True:
        success, img = cap.read()
        imgOutput = img.copy()
        hands, img = detector.findHands(img)
        if hands:
            hand = hands[0]
            x, y, w, h = hand['bbox']

            imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
            imgCrop = img[y - offset:y + h + offset, x - offset:x + w + offset]
            
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
                    prediction, index = classifier.getPrediction(imgWhite, draw=False)

            else:
                k = imgSize / w
                hCal = math.ceil(k * h)
                if imgCrop.size != 0:
                    imgResize = cv2.resize(imgCrop, (imgSize, hCal))
                    imgResizeShape = imgResize.shape
                    hGap = math.ceil((imgSize - hCal) / 2)
                    imgWhite[hGap:hCal + hGap, :] = imgResize
                    prediction, index = classifier.getPrediction(imgWhite, draw=False)

            cv2.rectangle(imgOutput, (x - offset, y - offset-50),
                          (x - offset+90, y - offset-50+50), (255, 0, 255), cv2.FILLED)
            cv2.putText(imgOutput, labels[index], (x, y -26), cv2.FONT_HERSHEY_COMPLEX, 1.7, (255, 255, 255), 2)
            cv2.rectangle(imgOutput, (x-offset, y-offset),
                          (x + w+offset, y + h+offset), (255, 0, 255), 4)

            ret, buffer = cv2.imencode('.jpg', imgOutput)
            imgOutput = buffer.tobytes()
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + imgOutput + b'\r\n')

@app.route('/')
def index():
    global cap
    if (cap != None):
        cap = None
    return render_template('index.html')

@app.route('/acercade')
def acercade():
    global cap
    if (cap != None):
        cap = None
    return render_template('AcercDnos.html')

@app.route('/aprende')
def aprende():
    global cap
    if (cap != None):
        cap = None
    return render_template('Aprende.html')

@app.route('/juegos')
def juegos():
    global cap
    if (cap != None):
        cap = None
    return render_template('ExplicacionJuegos.html')

@app.route('/juegos/ahorcado')
def juegoahorcado():
    global cap
    if (cap != None):
        cap = None
    return render_template('Ahorcado.html')

@app.route('/juegos/memorama')
def juegomemorama():
    global cap
    if (cap != None):
        cap = None
    return render_template('Memorama.html')

@app.route('/juegos/memorama/felicidades')
def juegomemoramafelicidades():
    global cap
    if (cap != None):
        cap = None
    return render_template('MemorFelicita.html')

@app.route('/juegos/sopaletras')
def juegosopaletras():
    global cap
    if (cap != None):
        cap = None
    return render_template('SopLetr.html')

@app.route('/juegos/ordenapalabras')
def juegoordenapalabras():
    global cap
    if (cap != None):
        cap = None
    return render_template('OrdenarLetr.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)
    