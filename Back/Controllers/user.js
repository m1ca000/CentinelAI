import {config} from './db.js';
import pkg from 'pg';
const {Client} = pkg;
const client = new Client(config);
const register = async (req, res) => {
    console.log("register user")
    await client.connect();
    console.log("conectado")
    const { email, username, password } = req.body;
    console.log("body", req.body)
    try {
        const query = 'INSERT INTO "user"("email", "username", "password") VALUES($1, $2, $3)';
        const values = [email, username, password];
        
        await client.query(query, values);
        await client.end();
        res.status(201).send('Usuario registrado con éxito');
    } catch (err) {
        console.error(err);
        await client.end();
        res.status(500).send('Error al registrar usuario');
    }
};

const user = {
    register,
};

export default user;
