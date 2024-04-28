const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemahorario"
});

router.post("/registrarEdificio", (req, res) => {
    const clave_Edificio = req.body.clave_Edificio;
    const nombre_Edificio = req.body.nombre_Edificio;
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;    
    const clave_UnidadAcademica = req.body.clave_UnidadAcademica;

    db.query('SELECT * FROM edificio WHERE clave_Edificio = ?',[clave_Edificio], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave del Edificio ya existe");
        }
        db.query('SELECT * FROM edificio WHERE nombre_Edificio = ?',[nombre_Edificio], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre del Edificio ya existe");
            }
            
            db.query('INSERT INTO edificio (clave_Edificio, nombre_Edificio, clave_ProgramaEducativo, clave_UnidadAcademica) VALUES (?, ?, ?, ?)',
                [clave_Edificio,nombre_Edificio,clave_ProgramaEducativo,clave_UnidadAcademica], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Programa educativo registrado con éxito");
            });
        });
    });
});

router.get("/consultarEdificio", (req, res) => {
    db.query('SELECT * FROM edificio', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});


router.put("/modificarEdificio", (req, res) => {
    const clave_Edificio = req.body.clave_Edificio;
    const nombre_Edificio = req.body.nombre_Edificio;
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;    
    const clave_UnidadAcademica = req.body.clave_UnidadAcademica;
    db.query('SELECT * FROM edificio WHERE nombre_Edificio = ? AND clave_Edificio != ?',[nombre_Edificio,clave_Edificio], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del Edificio ya existe");
        }
        
        db.query('UPDATE edificio SET nombre_Edificio=?, clave_ProgramaEducativo=?,clave_UnidadAcademica=? WHERE clave_Edificio=?',[nombre_Edificio,clave_ProgramaEducativo,clave_UnidadAcademica,clave_Edificio],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Unidad Academica modificada con exito");        
        });
    });
});

module.exports = router;