import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
const {Client} = pkg;
const client = new Client(config);

const register = async (req, res) => {
    const {Client} = pkg;
    const client = new Client(config);
    await client.connect();
    const { email, username, password } = req.body;
    console.log("body", req.body)
    try {
        const emailQuery = 'SELECT "email" FROM "user" WHERE "email" = $1';
        const emailValues = [email];
        const result = await client.query(emailQuery, emailValues);
        if (result.rows[0] == null){
            const userQuery = 'SELECT "username" FROM "user" WHERE "username" = $1'
            const userValues = [username];
            const result2 = await client.query(userQuery, userValues);
            if(result2.rows[0] == null){
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const query = 'INSERT INTO "user"("email", "username", "password") VALUES($1, $2, $3)';
                const values = [email, username, hashedPassword];
                await client.query(query, values);
                await client.end();
                res.status(201).json({ message: 'Usuario registrado con éxito'});
            }
            else{
                await client.end();
                res.status(401).json({ error: 'Este nombre ya se encuentra en uso' });
                return;
            }
        }
        else {
            await client.end();
            res.status(400).json({ error: 'Este email ya se encuentra en uso' });
            return;
        }
    } 
    catch (err) {
        console.error(err);
        await client.end();
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};


const login = async (req, res) => {
    const {Client} = pkg;
    const client = new Client(config);
    await client.connect();
    const { email, password } = req.body;
    try {
        const query = 'SELECT "email", "password" FROM "user" WHERE "email" = $1 ';
        const values = [email];
        const result = await client.query(query, values);
        if(result.rows.length > 0){
            const hashedPassword = result.rows[0].password;
            const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
            if(isPasswordMatch){
                const code = Math.floor(100000 + Math.random() * 900000);
                const timestamp = new Date();
                const updateQuery = 'UPDATE "user" SET "login_code" = $1, "login_code_timestamp" = $2 WHERE "email" = $3';
                const updateValues = [code, timestamp, email];
                await client.query(updateQuery, updateValues);

                const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Login Code',
                    text: `Esperamos que estés teniendo un excelente día.

Para completar tu autenticación y garantizar la seguridad de tu cuenta en CentinelAi, por favor utiliza el siguiente código:

Código de Autenticación: ${code}

Este código es válido por los próximos 5 minutos. Por favor, introdúcelo en la app para continuar.

Si no has solicitado este código, por favor ignora este mensaje o contáctanos de inmediato para asegurarnos de que tu cuenta esté segura.

Gracias por confiar en nosotros.

¡Que tengas un excelente día!

Saludos cordiales,
El equipo de CentinelAi`,
                };
                await transporter.sendMail(mailOptions);
                await client.end();
                res.status(200).json({ message: 'Sesión iniciada con éxito. Verifica tu email para obtener el código de login' });
            }
            else {
                await client.end();
                res.status(401).json({ error: 'La contraseña no coincide con el email' });
            }
        } 
        else {
            await client.end();
            res.status(401).json({ error: 'No se ha encontrado una cuenta con ese email' });
        }
    }
    catch (err) {
        console.error(err);
        await client.end();
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

const verifyCode = async (req, res) => {
    const {Client} = pkg;
    const client = new Client(config);
    await client.connect();
    try {
      const { email, code } = req.body;
  
      const query = 'SELECT "login_code", "login_code_timestamp" FROM "user" WHERE "email" = $1';
      const values = [email];
      const result = await client.query(query, values);
  
      if (result.rows.length > 0) {
        const storedCode = result.rows[0].login_code;
        const storedTimestamp = result.rows[0].login_code_timestamp;
  
        if (storedCode == code && new Date().getTime() - storedTimestamp < 300000) {
          res.status(200).json({ message: 'Código de login válido' });
        } else {
          res.status(401).json({ error: 'Código de login inválido o ha expirado' });
        }
      } else {
        res.status(404).json({ error: 'No se ha encontrado una cuenta con ese email' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al verificar código de login' });
    } finally {
      await client.end();
    }
};

const updatePassword = async (req, res) => {
    const {Client} = pkg;
    const client = new Client(config);
    await client.connect();
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
            res.status(201).json({ message: 'Contraseña modificada con exito' });
        }
    }
    catch {
        console.error(err);
        await client.end();
        res.status(500).json({ error:'Error al modificar contraseña'});
    }
};

const userGroup = async (req, res) => {
    const {Client} = pkg;
    const client = new Client(config);
    await client.connect();
    const { group, email} = req.body;
    try {
        const query = 'UPDATE "user" SET "group" = $1 WHERE "email" = $2';
        const values = [group, email];
        await client.query(query, values);
        await client.end();
        res.status(201).json({ message: 'Union al grupo exitosa' });
    }
    catch {
        console.error(err);
        await client.end();
        res.status(500).json({ error: 'Error al unirse al grupo' });
    }
}

const user = {
    register,
    login,
    verifyCode,
    updatePassword,
    userGroup,
};

export default user;
