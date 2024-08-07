import express from "express";

const app = express()
const PORT = 8000

import {config} from './db.js'

import pkg from 'pg'
const {Client} = pkg;

import cors from 'cors'
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World')
  })