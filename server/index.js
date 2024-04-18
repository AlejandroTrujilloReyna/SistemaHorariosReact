const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemahorario"
});

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});