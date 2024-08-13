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
        const emailQuery = 'SELECT "email" FROM "user" WHERE "email" = $1';
        const emailValues = [email];
        const result = await client.query(emailQuery, emailValues);
        if (result.rows[0] == null){
            const query = 'INSERT INTO "user"("email", "username", "password") VALUES($1, $2, $3)';
            const values = [email, username, password];
            await client.query(query, values);
            await client.end();
            res.status(201).send('Usuario registrado con éxito');
        }
        else {
            res.status(400).send('Este email ya se encuentra en uso');
            await client.end();
        }
    } 
    catch (err) {
        console.error(err);
        await client.end();
        res.status(500).send('Error al registrar usuario');
    }
};


const login = async (req, res) => {
    console.log("login user")
    await client.connect();
    console.log("conectado")
    const { email, password } = req.body;
    console.log("body", req.body)
    try {
        const query = 'SELECT "email", "password" FROM "user" WHERE "email" = $1 ';
        const values = [email];
        await client.query(query, values);
        const result = await client.query(query, values);
        if(result.rows.length > 0){
            const Password = result.rows[0].password
            if(Password == password){
                res.status(200).send('Sesión iniciada con éxito');
                await client.end();
            }
            else{
                res.status(401).send('La contraseña no coincide con el email');
                await client.end();
            }
        }
        else{
            res.status(404).send('No se ha encontrado una cuenta con ese email');
            await client.end();
        }
        
        
    }
    catch (err) {
        console.error(err);
        await client.end();
        res.status(500).send('Error al iniciar sesión');
    }
};

const updatePassword = async (req, res) => {
    console.log('Restaurar password');
    await client.connect();
    console.log('Conectado');
    const { email, password } = req.body;
    try {
        const query = 'SELECT "email", "password" FROM "user" WHERE "email" = $1';
        const values = [email];
        await client.query(query, values);
        const result = await client.query(query, values);
        if(result.rows.length > 0) {
            const queryPass = 'UPDATE "user" SET "password" = $1 WHERE "email" = $2';
            const valuesPass = [password, email];
            await client.query(queryPass, valuesPass);
            console.log("body", req.body)
            await client.end();
            res.status(201).send('Contraseña modificada con exito');
        }
    }
    catch {
        console.error(err);
        await client.end();
        res.status(500).send('Error al modificar contraseña');
    }
};

const user = {
    register,
    login,
    updatePassword,
};

export default user;
