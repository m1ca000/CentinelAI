import dotenv from 'dotenv';
dotenv.config();
import {config} from './db.js';
import pkg from 'pg';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
const {Client} = pkg;
const client = new Client(config);

function invitationCode(longitud = 8) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < longitud; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
};

const uniqueCode = async () => {
    let codigo;
    let existe = true;
    while (existe) {
        codigo = invitationCode();
        const codeQuery = 'SELECT "invite_code" FROM "group" WHERE "invite_code" = $1';
        const codeValues = [codigo];
        const codeResult = await client.query(codeQuery, codeValues);
        if (codeResult.rows.length === 0) {
            existe = false;
        }
    }
    return codigo;
};

const createGroup = async (req, res) => {
    await client.connect();
    const { name } = req.body;
    try {
        const codigo = uniqueCode();
        const nameQuery = 'SELECT "name" FROM "group" WHERE "name" = $1';
        const nameValues = [name];
        const nameResult = await client.query(nameQuery, nameValues);
        if (nameResult.rows[0] == null) {
            const groupQuery = 'INSERT INTO "group"("name", "invite_code") VALUES($1, $2)';
            const groupValues = [name, codigo];
            await client.query(groupQuery, groupValues);
        }
    }
    catch {
        console.error(err);
        await client.end();
        res.status(500).json({ error: 'Error al crear grupo' });
    }
};

const group = {
    createGroup,
};

export default group;