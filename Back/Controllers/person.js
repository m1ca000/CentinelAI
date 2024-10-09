import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
const {Client} = pkg;
import cloudinary from '../Config/CloudConfig.js'
import personServices from '../Service/personServices.js';


const uploadInfo = async (req, res) => {
  try {
    const file = req.file;
    const {name, surname, DNI, } = req.body;
    if (!name || !surname || !DNI || !file) {
      return res.status(400).json({ error: 'Falta archivo o info' });
    }

    cloudinary.uploader.upload_stream(async (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({ error: 'Error subiendo la imagen a Cloudinary' });
      }
  
      const imageUrl = result.secure_url;
  
      try {
        const newPerson = await personServices.savePerson(name, surname, DNI, imageUrl);
        res.status(201).json({ message: 'Se guardo correctamente la información' });
      } 
      catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error:'Error guardando la info de la persona' });
      }
    })  
    .end(file.buffer);
  }
  catch (err) {
    console.error('Error subiendo la imagen:', err);
    res.status(500).json({ error: 'Error subiendo la imagen' });
  }
};

const person = {
    uploadInfo,
};

export default person;