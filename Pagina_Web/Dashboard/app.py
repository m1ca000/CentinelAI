import cv2
import os
import imutils
import glob
from flask import Flask, render_template, Response, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
face_cascade = cv2.CascadeClassifier(
    r'C:/Users/feder/OneDrive/Escritorio/CentinelAI/Pagina_Web/Dashboard/Resources/Seleccionamiento-Facial.xml'
)
cap = cv2.VideoCapture(0)
CarpetaDeCaras = r"C:/Users/feder/OneDrive/Escritorio/CentinelAI/Pagina_Web/Dashboard/Faces"

# Function to capture photo and save face
def ShootPhoto(carpeta, nombre, pareidolia, image):
    for (x, y, w, h) in pareidolia:
        rectangulo = image[y:y + h, x:x + w]
        rectangulo = cv2.resize(rectangulo, (600, 600), interpolation=cv2.INTER_CUBIC)
        ubicacion = os.path.join(carpeta, nombre)
        cv2.imwrite(ubicacion, rectangulo)
        print('Imagen guardada:', ubicacion)
        return ubicacion

# Function to draw rectangle on detected face
def DibujarRectangulo(b, g, r, d, pareidolia, image):
    for (x, y, w, h) in pareidolia:
        cv2.rectangle(image, (x, y), (x + w, y + h), (b, g, r), d)

# Video stream generator
def gen():
    while True:
        ret, img = cap.read()
        if not ret:
            print("Error en la captura")
            break
        img = imutils.resize(img, width=640)
        gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        cara = face_cascade.detectMultiScale(gris, scaleFactor=1.1, minNeighbors=4, minSize=(70, 70))
        DibujarRectangulo(255, 100, 0, 5, cara, img)
        ret, jpeg = cv2.imencode('.jpg', img)
        if ret:
            frame = jpeg.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

# Route to stream the camera feed
@app.route('/video_feed')
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Route to handle the photo capture
@app.route('/capture', methods=['POST'])
def capture_photo():
    ret, img = cap.read()  # Capture the frame here
    if not ret:
        return jsonify({"status": "error", "message": "Failed to capture image"}), 500

    img = imutils.resize(img, width=640)
    gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cara = face_cascade.detectMultiScale(gris, scaleFactor=1.1, minNeighbors=4, minSize=(70, 70))
    auxFrame = img.copy()

    if not os.path.exists(CarpetaDeCaras):
        os.makedirs(CarpetaDeCaras)

    ListaDeRostros = glob.glob(os.path.join(CarpetaDeCaras, '*'))
    i = len(ListaDeRostros) + 1
    image_path = ShootPhoto(CarpetaDeCaras, f"image.jpeg", cara, auxFrame)
    return jsonify({"status": "success", "imagePath": image_path}), 200

# Route to upload an image
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400
    filename = secure_filename(file.filename)
    file.save(os.path.join(CarpetaDeCaras, filename))
    return jsonify({"status": "success", "message": "File uploaded"}), 200

# Home route to serve the HTML page
@app.route('/')
def index():
    return render_template('Dashboard.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
