import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
const {Client} = pkg;
const client = new Client(config);
import cloudinary from '../Config/CloudConfig.js';
import axios from 'axios';

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
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(async (error, result) => {
        if (error) {
          return reject(error);
        }
        const imageURL = result.secure_url;
        resolve(imageURL);
        }).end(fileBuffer);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

const savePerson = async (name, surname, DNI, imageURL, group) => {
    const client = new Client(config);
    await client.connect();

    try {
        const {rows} = await client.query (
            'INSERT INTO "person"("name", "surname", "DNI", "photo", "group") VALUES($1, $2, $3, $4, $5)',
            [name, surname, DNI, imageURL, group]
        )
    }
    catch (error) {
        await client.end();
        throw error;
    }
}

const existingPerson = async (name, surname, DNI, group) => {
  const client = new Client(config);
  await client.connect();

  try {
    const {rows} = await client.query (
      'SELECT * FROM "person" WHERE "name" = $1 && "surname" = $2 && "DNI" = $3 && "group" = $4',
      [name, surname, DNI, group]
    )

    return rows;
  }
  catch (error) {
    await client.end();
    throw error;
  }
}

const sendImageToAPI = async (imageBuffer) => {
  console.log("Entro a la función")
  // Leer la imagen y convertirla a base64
  const imageBase64 = imageBuffer.toString("base64");
  console.log("Leyo la imagen y la convirtio");
  // Hacer la solicitud a la API

  axios({
    method: "POST",
    url: "https://classify.roboflow.com/face-recogntion-2/1",
    params: {
      api_key: process.env.IA_KEY
    },
    data: imageBase64,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(function (response) {
      console.log("Respuesta de la API:", response.data);
    })
    .catch(function (error) {
      console.log("Error:", error.message);
    });
}

export default {
    getAll,
    uploadToCloudinary,
    savePerson,
    existingPerson,
    sendImageToAPI,
}