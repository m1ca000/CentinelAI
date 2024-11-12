import userServices  from "../Service/userServices.js";
import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
import bcrypt from 'bcrypt';
const {Client} = pkg;
const client = new Client(config);
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    const { email, username, password } = req.body;
    console.log("body", req.body)
    try {
        const emailExistente = await userServices.getUsuarioByEmail(email);
        if (!emailExistente){
            const usernameExistente = await userServices.getUsuarioByUsername(username);
            if(!usernameExistente){
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const createUser = await userServices.createUsuario(email, username, hashedPassword);
                const sendEmail = await userServices.sendEmail(email);

                return res.status(201).json({ message: 'Usuario registrado con éxito. Verifica tu email'});
            }
            else {
                return res.status(401).json({ error: 'Este nombre ya se encuentra en uso' });
            }
        }
        else {
            return res.status(400).json({ error: 'Este email ya se encuentra en uso' });
        }
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

const verifyEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const confEmail = await userServices.verifyEmail(email);
        return res.status(201).json({ message: 'Email verificado con exito'})
        
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error:'Error al verificar Email'});
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await userServices.getUsuarioByEmail(email)
        if(usuario){
            const hashedPassword = usuario.password;
            const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
            if(isPasswordMatch){
                const code = Math.floor(100000 + Math.random() * 900000);
                const loginCode = await userServices.createVerificationCode(code, email);
                const sendLoginCode = await userServices.sendLoginCode(email, code);

                const token = jwt.sign({ email: usuario.email, username: usuario.username }, process.env.SECRET_KEY);
                res.status(200).json({ message: 'Sesión iniciada con éxito. Verifica tu email para obtener el código de login', token });
            }
            else {
                await client.end();
                res.status(401).json({ error: 'La contraseña no coincide con el email' });
            }
        } 
        else {
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
    const email = req.userEmail;
    const { code } = req.body;
    try {
        const usuario = await userServices.getUsuarioByEmail(email);
        if (usuario) {
        const storedCode = usuario.login_code;
        const storedTimestamp = usuario.login_code_timestamp;

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
    }
};

const updatePassword = async (req, res) => {
    const email = req.userEmail;
    const { password } = req.body;

    try {
        const usuario = await userServices.getUsuarioByEmail(email)
        if(usuario) {
            const newPassword = await userServices.updatePassword(email, password);
            res.status(201).json({ message: 'Contraseña modificada con exito' });
        }
        else {
            res.status(404).json({ error: 'No se encontro un usuario' })
        }
    }
    catch {
        console.error(err);
        res.status(500).json({ error:'Error al modificar contraseña'});
    }
};

const userGroup = async (req, res) => {
    const client = new Client(config);
    await client.connect();
    const email = req.userEmail;
    const { groupCode } = req.body;
    try {
        const userGroup = await userServices.userGroup(groupCode, email);
        res.status(201).json({ message: 'Union al grupo exitosa' });
    }
    catch {
        console.error(err);
        res.status(500).json({ error: 'Error al unirse al grupo' });
    }
}

const resendEmail = async (req, res) => {
    const {email} = req.userEmail;
    
    try {
        const usuario = await userServices.getUsuarioByEmail(email)
        if (usuario) {
            const code = Math.floor(100000 + Math.random() * 900000);
            const createCode = await userServices.createVerificationCode(code, email)
            const resendEmail = await userServices.sendLoginCode(email, code)

            res.status(200).json({ message: 'Email reenviado con exito' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al reenviar el codigo' });
    }
}
const user = {
    register,
    login,
    verifyCode,
    updatePassword,
    userGroup,
    resendEmail,
    verifyEmail,
};

export default user;
