import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from "pg";
const { Client } = pkg;
import nodemailer from 'nodemailer';

const getUsuarioByEmail = async (email) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            'SELECT * FROM "user" WHERE "email" = $1',
            [email]
        );
        if (rows.length < 1) return null;

        await client.end();
        return rows[0];
    } catch (error) {
        await client.end();
        throw error;
    }
};

const getUsuarioByUsername = async (username) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            'SELECT * FROM "user" WHERE "username" = $1',
            [username]
        );
        if (rows.length < 1) return null;

        await client.end();
        return rows[0];
    } catch (error) {
        await client.end();
        throw error;
    }
};

const createUsuario = async (email, username, password) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            'INSERT INTO "user"("email", "username", "password", "type", "is_verified") VALUES($1, $2, $3, $4, false)',
            [email, username, password, "not admin"]
        );

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const sendEmail = async (email) => {
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
            subject: 'Email Verification',
            text: `Para completar tu autenticación y garantizar la seguridad de tu cuenta en CentinelAi, por favor ingrese al siguiente link para verificar que este email es valido:

Link:

Gracias por confiar en nosotros.

¡Que tengas un excelente día!

Saludos cordiales,
El equipo de CentinelAi`,
        };
    await transporter.sendMail(mailOptions);
}

const verifyEmail = async (email) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            'UPDATE "user" SET "is_verified" = true WHERE "email" = $1',
            [email]
        );
        await client.end();
        return rows;
    }
    catch (error) {
        await client.end();
        throw error;
    }
}

const createVerificationCode = async (code, email) => {
    const client = new Client(config);
    await client.connect();

    try {
        const timestamp = new Date();
        const {rows} = await client.query(
            'UPDATE "user" SET "login_code" = $1, "login_code_timestamp" = $2 WHERE "email" = $3',
            [code, timestamp, email]
        );
        await client.end();
        return rows;
    }
    catch (error) {
        await client.end();
        throw error;
    }
}

const sendLoginCode = async (email, code) => {
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
        text: `Para completar tu autenticación y garantizar la seguridad de tu cuenta en CentinelAi, por favor utiliza el siguiente código:

Código de Autenticación: ${code}

Este código es válido por los próximos 5 minutos. Por favor, introdúcelo en la app para continuar.

Si no has solicitado este código, por favor ignora este mensaje o contáctanos de inmediato para asegurarnos de que tu cuenta esté segura.

Gracias por confiar en nosotros.

¡Que tengas un excelente día!

Saludos cordiales,
El equipo de CentinelAi`,
    };
    await transporter.sendMail(mailOptions);
}

const updatePassword = async (email, password) => {
    const client = new Client(config);
    await client.connect();

    try {
        const {rows} = await client.query(
        'UPDATE "user" SET "password" = $1 WHERE "email" = $2',
        [password, email]
        );
        await client.end();
        return rows;
    }
    catch (error) {
        await client.end();
        throw error;
    }

}

const userGroup = async (group, email) => {
    const client = new Client(config);
    await client.connect();

    try {
        const {rows} = await client.query(
            'UPDATE "user" SET "group" = $1 WHERE "email" = $2',
            [group]
        );
    }
    catch (error) {
        await client.end();
        throw error;
    }
}
export default { 
    getUsuarioByEmail, 
    getUsuarioByUsername, 
    createUsuario, 
    sendEmail, 
    verifyEmail, 
    createVerificationCode, 
    sendLoginCode,
    updatePassword,
    userGroup,
}