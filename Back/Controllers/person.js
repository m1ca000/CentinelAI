import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
const {Client} = pkg;
import cloudinary from '../Config/CloudConfig.js';
import personServices from '../Service/personServices.js';
import groupServices from '../Service/groupServices.js';
import axios from 'axios';
import fs from 'fs';

const uploadInfo = async (req, res) => {
  const email = req.userEmail;
  try {
    const file = req.file.buffer;
    const {name, surname, DNI } = req.body;
    if (!name || !surname || !DNI || !file) {
      return res.status(400).json({ error: 'Falta archivo o info' });
    }
    const userGroup = await groupServices.getGroupByUser(email);
    const group = userGroup.rows[0].group_id
    const existingPerson = await personServices.existingPerson(name, surname, DNI, group);

    if (!existingPerson) {
      const photo = await personServices.uploadToCloudinary(file);
      const newPerson = await personServices.savePerson(name, surname, DNI, photo, group);
      return res.status(201).json({ message: 'Persona registrada con exito' });
    }
    
    return res.status(409).json({ message: 'Ya existe un registro igual' })

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const sendImageToIa = async (req, res) => {
  if (!req.file.buffer) {
    return res.status(400).json({ error: 'No file provided' });
  }  
  try {
    const image = req.file.buffer;
    if(!image) {
      return res.status(400).json({ error: 'Falta archivo o info' });
    }
    const resultFromIa = await personServices.sendImageToAPI(image);
    return res.status(201).json({ message: 'Imagen procesada con exito', data: resultFromIa });
  }
  catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' })
  }
};

const person = {
    uploadInfo,
    sendImageToIa,
};

export default person;