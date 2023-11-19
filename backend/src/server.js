const express = require('express');
const app = express();
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from './config/connectDB';
import cors from 'cors';
require('dotenv').config();

// let app = Express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors({
    origin:['http://localhost:3000','http://localhost:3000'],
    credentials:true
}));

app.use(function (req, res, next) {

  res.header('Access-Control-Allow-Origin', "http://localhost:3000");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});
viewEngine(app);

initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8668;

app.listen(port, () => {
    console.log("Backend NodeJS is running on port: " + port);
});

