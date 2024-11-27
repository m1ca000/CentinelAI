import logging
from flask import Flask, render_template, Response, request, jsonify, send_from_directory
from flask_cors import CORS  # Import CORS
import os
import cv2
import imutils
import glob
from werkzeug.utils import secure_filename

# Setup logging to capture errors in detail
logging.basicConfig(level=logging.DEBUG)  # Log debug and higher level messages

# Create the Flask app object first
app = Flask(__name__)

# Enable CORS for the entire app
CORS(app)

# Obtener la ruta relativa al directorio de este script
script_dir = os.path.dirname(__file__)

# Ruta relativa para el archivo XML
xml_path = os.path.join(script_dir, "Resources", "Seleccionamiento-Facial.xml")
if not os.path.exists(xml_path):
    logging.error(f"Archivo no encontrado: {xml_path}")
    raise FileNotFoundError(f"Archivo no encontrado: {xml_path}")

face_cascade = cv2.CascadeClassifier(xml_path)

# Ruta relativa para la carpeta Faces
faces_dir = os.path.join(script_dir, "..", "..", "Faces")
if not os.path.exists(faces_dir):
    os.makedirs(faces_dir)  # Crear la carpeta si no existe

# Serve images from the 'Faces' directory as static files
@app.route('/Faces/<filename>')
def serve_image(filename):
    return send_from_directory(faces_dir, filename)

# Initialize the webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    logging.error("Error: Unable to access the webcam.")
    raise Exception("Camera not found or in use.")

# Function to capture photo and save face
def ShootPhoto(carpeta, nombre, pareidolia, image):
    for (x, y, w, h) in pareidolia:
        rectangulo = image[y:y + h, x:x + w]
        rectangulo = cv2.resize(rectangulo, (600, 600), interpolation=cv2.INTER_CUBIC)
        ubicacion = os.path.join(carpeta, nombre)
        cv2.imwrite(ubicacion, rectangulo)
        logging.info(f'Imagen guardada: {ubicacion}')
        return f'/Faces/{nombre}'  # Return a relative URL

# Function to draw rectangle on detected face
def DibujarRectangulo(b, g, r, d, pareidolia, image):
    for (x, y, w, h) in pareidolia:
        cv2.rectangle(image, (x, y), (x + w, y + h), (b, g, r), d)

# Video stream generator
def gen():
    try:
        while True:
            ret, img = cap.read()
            if not ret:
                logging.error("Error en la captura del video.")
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
    except Exception as e:
        logging.error(f"Error in video stream generation: {e}")

# Route to stream the camera feed
@app.route('/video_feed')
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Route to handle the photo capture
@app.route('/capture', methods=['POST'])
def capture_photo():
    try:
        ret, img = cap.read()  # Capture the frame here
        if not ret:
            logging.error("Error capturing photo.")
            return jsonify({"status": "error", "message": "Failed to capture image"}), 500

        img = imutils.resize(img, width=640)
        gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        cara = face_cascade.detectMultiScale(gris, scaleFactor=1.1, minNeighbors=4, minSize=(70, 70))
        auxFrame = img.copy()

        ListaDeRostros = glob.glob(os.path.join(faces_dir, '*'))
        i = len(ListaDeRostros) + 1
        image_path = ShootPhoto(faces_dir, f"image_{i}.jpeg", cara, auxFrame)
        return jsonify({"status": "success", "imagePath": image_path}), 200
    except Exception as e:
        logging.error(f"Error in photo capture: {e}")
        return jsonify({"status": "error", "message": "An error occurred"}), 500

# Route to upload an image
@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        if 'file' not in request.files:
            return jsonify({"status": "error", "message": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"status": "error", "message": "No selected file"}), 400
        filename = secure_filename(file.filename)
        file.save(os.path.join(faces_dir, filename))
        return jsonify({"status": "success", "message": "File uploaded"}), 200
    except Exception as e:
        logging.error(f"Error during image upload: {e}")
        return jsonify({"status": "error", "message": "An error occurred during upload"}), 500

# Home route to serve the HTML page
@app.route('/')
def index():
    return render_template('Dashboard.html')

if __name__ == '__main__':
    # Disable Flask's reloader for better error logging visibility
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)