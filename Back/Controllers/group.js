import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
const {Client} = pkg;
const client = new Client(config);
import groupServices from '../Service/groupServices.js';

const uniqueCode = async () => {
    let codigo;
    let existe = true;
    try {
        while (existe) {
        codigo = groupServices.invitationCode();
        const codeSelect = await groupServices.getGroupByCode(codigo);
        if (!codeSelect.invitationCode) {
            existe = false;
        }
    }
    }
    catch (err) {
        throw err;
    }
    
    return codigo;
};

const createGroup = async (req, res) => {
    const { name } = req.body;
    const email = req.userEmail;
    try {
        const codigo = await uniqueCode();
        const group = await groupServices.getGroupByName(name);
        if (group.length === 0) {
            const createGroup = await groupServices.createGroup(name, codigo, email);
            res.status(201).json({ message: 'Grupo creado con exito' });
        }
        else {
            res.status(401).json({ error: 'Este nombre ya se encuentra en uso' });
            return;
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear grupo' });
    }
};

const deleteGroup = async (req, res) => {
    const {name} = req.body;
    try {
        const group = await groupServices.getGroupByName(name);
        const groupId = group[0].group_id;
        if (group) {

            const deleteGroup = await groupServices.deleteGroup(groupId, name)
            res.status(201).json({ message: 'Grupo eliminado con éxito'});            
        }
        else {
            res.status(401).json({ error: 'No existe un grupo con este nombre' });
            return;
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar grupo' });
    }
}

const showGroupCode = async (req, res) => {
    const email = req.userEmail
    try {
        const group = await groupServices.getGroupByUser(email);
        if (group) {
        return res.status(200).json({ invitationCode: group.invite_code });
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const group = {
    createGroup,
    deleteGroup,
    showGroupCode,
};

export default group;