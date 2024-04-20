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

        db.query('INSERT INTO unidadacademica(clave_UnidadAcademica, nombre_UnidadAcademica) VALUES (?, ?)',
        [clave_UnidadAcademica, nombre_UnidadAcademica], (err, result) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Unidad Académica registrada con éxito");
        });    
    });
});

app.get("/unidadesAcademicas", (req, res) => {
    db.query('SELECT clave_UnidadAcademica, nombre_UnidadAcademica FROM unidadacademica', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
  });

app.post("/registrarProgramaEducativo", (req, res) => {
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;
    const nombre_ProgramaEducativo = req.body.nombre_ProgramaEducativo;
    const banco_Horas = req.body.banco_Horas;
    const min_Grupo = req.body.min_Grupo;
    const max_Grupo = req.body.max_Grupo;
    const clave_UnidadAcademica = req.body.clave_UnidadAcademica;

    db.query('INSERT INTO programaeducativo(clave_ProgramaEducativo, nombre_ProgramaEducativo, banco_Horas, min_Grupo, max_Grupo, clave_UnidadAcademica) VALUES (?, ?, ?, ?, ?, ?)',
        [clave_ProgramaEducativo, nombre_ProgramaEducativo, banco_Horas, min_Grupo, max_Grupo, clave_UnidadAcademica], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Programa educativo registrado con éxito");
        });
});

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});