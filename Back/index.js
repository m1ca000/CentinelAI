import express from "express";
import cors from 'cors';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configuración express
const app = express()
const PORT = 8000

// Configuración multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middlewares
const corsOptions = {
    origin: '*', // permitir acceso desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // permitir métodos HTTP
    allowedHeaders: ['Content-Type', 'Authorization'], // permitir headers
    // credentials: true
  };
app.use(cors(corsOptions));
app.use(express.json());

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
})

//Prueba
app.get('/', (req, res) => {
    res.send('Hello World')
})

//Rutas
import user from "./Controllers/user.js";
import group from "./Controllers/group.js";
import camera from "./Controllers/camera.js";
import person from "./Controllers/person.js";

//User
app.post('/api/register', user.register)
app.post('/api/login', user.login)
app.put('/api/updatePassword', user.updatePassword)
app.post('/api/verifyCode', user.verifyCode)
app.put('/api/userGroup', user.userGroup)

//Group
app.post('/api/createGroup', group.createGroup)
app.post('/api/deleteGroup', group.deleteGroup)

//Camera


//Person
app.post('/api/uploadInfo', upload.single('photo'), person.uploadInfo)