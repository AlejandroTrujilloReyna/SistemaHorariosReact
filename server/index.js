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

app.post("/registrarUnidadAcademica",(req,res)=>{
    const clave_UnidadAcademica = req.body.clave_UnidadAcademica;
    const nombre_UnidadAcademica = req.body.nombre_UnidadAcademica;

    db.query('SELECT * FROM unidadacademica WHERE clave_UnidadAcademica = ?',[clave_UnidadAcademica], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave de la Unidad Académica ya existe");
        }        

        db.query('INSERT INTO unidadacademica(clave_UnidadAcademica, nombre_UnidadAcademica) VALUES (?, ?)', [clave_UnidadAcademica, nombre_UnidadAcademica], (err, result) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Unidad Académica registrada con éxito");
        });    
    });
});

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});