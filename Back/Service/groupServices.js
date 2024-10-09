import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
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

const getGroupByCode = async (code) => {
    const client = new Client(config);
    await client.connect();

    try {
        const {rows} = await client.query(
            'SELECT * FROM "group" WHERE "invite_code" = $1',
            [code]
        );
        await client.end();
        return rows;
    }
    catch (error) {
        await client.end()
        throw error;
    }
}

const getGroupByName = async (name) => {
    const client = new Client(config);
    await client.connect();

    try{
        const {rows} = await client.query(
            'SELECT * FROM "group" WHERE "name" = $1',
            [name]
        );
        await client.end();
        return rows;
    }
    catch(error) {
        client.end();
        throw error;
    }
}

const createGroup = async (name, code, email) => {
    const client = new Client(config);
    await client.connect();

    try {
        const {rows} = await client.query(
            'INSERT INTO "group"("name", "invite_code") VALUES($1, $2)',
            [name, code]
        );

        if (rows) {
            const {rows2} = await client.query(
                'UPDATE "user" SET "group" = $1, "type" = \'owner\' WHERE "email" = $2',
                [rows.group_id, email]
            )
        }
        await client.end();
    }
    catch (error) {
        await client.end();
        throw error;
    }
}

const deleteGroup = async (groupId, groupName) => {
    const client = new Client(config);
    await client.connect();

    try {
        const {rows} = await client.query(
            'UPDATE "user" SET "type" = null, "group" = null WHERE "group" = $1',
            [groupId]
        );

        if (rows) {
            const {rows2} = await client.query(
                'DELETE FROM "group" WHERE "name" = $1',
                [groupName]
            )
        }
        await client.end();
    }
    catch (error) {
        await client.end();
        throw error;
    }

}
export default {
    invitationCode,
    getGroupByCode,
    getGroupByName,
    createGroup,
    deleteGroup,
}