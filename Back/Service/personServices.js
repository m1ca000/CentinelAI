import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
const {Client} = pkg;
const client = new Client(config);
import cloudinary from '../Config/CloudConfig.js'

const getAll = async () => {
    const client = new Client(config);
    await client.connect;

    try {
        const {rows} = await client.query(
            'SELECT "person_ID", "photo" FROM "person"'
        );
        await client.end();
        return rows
    }
    catch(error) {
        await client.end();
        throw error;
    }
}

const uploadToCloudinary = async (fileBuffer) => {
    try {
      const result = await cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          throw error;
        }
        return result;
      })
      .end(fileBuffer);
      
      return result.secure_url;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

const savePerson = async (name, surname, DNI, imageURL) => {
    const client = new Client(config);
    await client.connect();

    try {
        const {rows} = await client.query (
            'INSERT INTO "person"("name", "surname", "DNI", "photo") VALUES($1, $2, $3, $4)',
            [name, surname, DNI, imageURL]
        )
    }
    catch (error) {
        await client.end();
        throw error;
    }
}

export default {
    getAll,
    uploadToCloudinary,
    savePerson,
}