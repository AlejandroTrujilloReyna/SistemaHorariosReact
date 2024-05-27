const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarModificarSubgrupos", (req, res) => {
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;
    const clave_UnidadAprendizajePlanEstudios = req.body.clave_UnidadAprendizajePlanEstudios;

    db.query('SELECT * FROM modificarsubgrupos WHERE clave_ProgramaEducativo = ? AND clave_UnidadAprendizajePlanEstudios = ?',
    [clave_ProgramaEducativo, clave_UnidadAprendizajePlanEstudios], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("Registro ya existente");
        }    

        db.query('INSERT INTO modificarsubgrupos(clave_ProgramaEducativo, clave_UnidadAprendizajePlanEstudios) VALUES (?, ?)',
        [clave_ProgramaEducativo, clave_UnidadAprendizajePlanEstudios], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Programa educativo registrado con éxito");
        });  
    });
});

router.get("/consultarModificarSubgrupos", (req, res) => {//QUITAR CUANDO UNAS TODO
    db.query('SELECT * FROM modificarsubgrupos ORDER BY clave_ModificarSubgrupos', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarModificarSubgrupos", (req, res) => {
    const clave_ModificarSubgrupos = req.body.clave_ModificarSubgrupos;
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;
    const clave_UnidadAprendizajePlanEstudios = req.body.clave_UnidadAprendizajePlanEstudios;
    db.query('SELECT * FROM modificarsubgrupos WHERE clave_ProgramaEducativo = ? AND clave_UnidadAprendizajePlanEstudios = ? AND clave_ModificarSubgrupos != ?',
    [clave_ProgramaEducativo, clave_UnidadAprendizajePlanEstudios, clave_ModificarSubgrupos], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("Registro ya existente");
        }        
        db.query('UPDATE modificarsubgrupos SET clave_ProgramaEducativo = ?, clave_UnidadAprendizajePlanEstudios = ?  WHERE clave_ModificarSubgrupos = ?',
        [clave_ProgramaEducativo, clave_UnidadAprendizajePlanEstudios, clave_ModificarSubgrupos],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Programa Educativo modificado con exito");        
        });
    });
});    

router.get("/obtenerUAPE", (req, res) => {//QUITAR CUANDO UNAS TODO
    
    db.query('SELECT * FROM unidadaprendizajeplanestudios ORDER BY clave_UnidadAprendizajePlanEstudios', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

module.exports = router;