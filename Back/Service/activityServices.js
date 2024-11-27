import dotenv from 'dotenv';
dotenv.config();
import {config} from '../Config/db.js';
import pkg from 'pg';
const {Client} = pkg;
const client = new Client(config);
import userServices from './personServices.js'

const recordActivity = async (person, date_hour) => {
    const client = new Client(config);
    await client.connect();
    try {
        const {rows} = await client.query (
            'INSERT INTO "activity"("person", "date_hour") VALUES($1, $2)',
            [person, date_hour]
        );
    }
    catch (error) {
        await client.end();
        throw error;
    }
}