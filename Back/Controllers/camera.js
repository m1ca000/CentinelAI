import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
const {Client} = pkg;
const client = new Client(config);
import cloudinary from '../Config/CloudConfig.js'

const camera = {
};

export default camera;