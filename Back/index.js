import express from "express";
import cors from 'cors';
import multer from 'multer';
import authMidd from "./Middleware/auth.js";
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
app.put('/api/updatePassword', authMidd.verifyToken, user.updatePassword)
app.post('/api/verifyCode', authMidd.verifyToken, user.verifyCode)
app.put('/api/userGroup', authMidd.verifyToken, user.userGroup)
app.post('/api/resendEmail', authMidd.verifyToken, user.resendEmail)
app.put('/api/verifyEmail', authMidd.verifyToken, user.verifyEmail)

//Group
app.post('/api/createGroup', authMidd.verifyToken, group.createGroup)
app.delete('/api/deleteGroup', authMidd.verifyToken, authMidd.verifyAdmin, authMidd.verifyOwner, group.deleteGroup)

//Camera


//Person
app.post('/api/uploadInfo', authMidd.verifyToken, authMidd.verifyAdmin, upload.single('photo'), person.uploadInfo)
app.post('/api/sendImage', authMidd.verifyToken, upload.single('photo'), person.sendImageToIa)