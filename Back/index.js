import express from "express";
import cors from 'cors'

const app = express()
const PORT = 8000

app.use(cors({
    origin: '*',
    credentials: true
  }));

// Middlewares
app.use(cors());
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

//User
app.post('/api/register', user.register)
app.post('/api/login', user.login)
