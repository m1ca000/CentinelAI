import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
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
            await client.end();
            res.status(201).json({ message: 'Grupo creado con exito' })
        }
        else {
            await client.end();
            res.status(401).json({ error: 'Este nombre ya se encuentra en uso' });
            return;
        }
    }
    catch {
        console.error(err);
        await client.end();
        res.status(500).json({ error: 'Error al crear grupo' });
    }
};

const deleteGroup = async (req, res) => {
    await client.connect();
    const {name} = req.body;
    try {
        const nameQuery = 'SELECT "name" FROM "group" WHERE "name" = $1';
        const nameValues = [name];
        const nameResult = await client.query(nameQuery, nameValues);
        if (nameResult.rows.length > 0) {
            const deleteQuery = 'DELETE FROM "group" WHERE "name" = $1';
            const deleteValues = [name];
            await client.query(deleteQuery,deleteValues);
            await client.end()
            res.status(201).json({ message: 'Grupo eliminado con éxito'});
        }
        else {
            await client.end();
            res.status(401).json({ error: 'No existe un grupo con este nombre' });
            return;
        }
    }
    catch {
        console.error(err);
        await client.end();
        res.status(500).json({ error: 'Error al eliminar grupo' });
    }
}

const group = {
    createGroup,
    deleteGroup,
};

export default group;