const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemahorario"
});

router.post("/registrarUnidadAcademica",(req,res)=>{
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
        
        db.query('SELECT * FROM unidadacademica WHERE nombre_UnidadAcademica = ?',[nombre_UnidadAcademica], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre de la Unidad Académica ya existe");
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
});

router.get("/consultarUnidadAcademica", (req, res) => {
    db.query('SELECT * FROM unidadacademica', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

module.exports = router;