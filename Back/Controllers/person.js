import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
const {Client} = pkg;
const client = new Client(config);
import cloudinary from '../Config/CloudConfig.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary';


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
          await client.connect();
          const query = 'INSERT INTO "person"("name", "surname", "DNI", "photo") VALUES($1, $2, $3, $4)';
          const values = [name, surname, DNI, imageUrl];
          await client.query(query, values);
          await client.end();
          res.status(201).json({ message: 'Se guardo correctamente la información' });
        } catch (dbError) {
          await client.end();
          console.error('Database error:', dbError);
          res.status(500).json({ error:'Error guardando la imagen en la base de datos' });
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