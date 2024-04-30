const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemahorario"
});

router.post("/registrarTipoSala", (req, res) => {
    const clave_TipoSala = 0;
    const nombre_TipoSala = req.body.nombre_TipoSala;
    db.query('SELECT * FROM tiposala WHERE nombre_TipoSala = ?',[nombre_TipoSala], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre TipoSala ya existe");
        }
        db.query('INSERT INTO tiposala (clave_TipoSala, nombre_TipoSala) VALUES (?, ?)',
                [clave_TipoSala,nombre_TipoSala], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Tipo Sala registrado con éxito");
            });
    });
});

router.get("/consultarTipoSala", (req, res) => {
    db.query('SELECT * FROM tiposala', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarTipoSala", (req, res) => {
    const clave_TipoSala = req.body.clave_TipoSala;
    const nombre_TipoSala = req.body.nombre_TipoSala;
    db.query('SELECT * FROM tiposala WHERE nombre_TipoSala = ? AND clave_TipoSala != ?',[nombre_TipoSala,clave_TipoSala],(err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del Tipo Sala ya existe");
        }

        db.query('UPDATE tiposala SET nombre_TipoSala = ? WHERE clave_TipoSala = ?',[nombre_TipoSala,clave_TipoSala],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Tipo Sala modificada con exito");        
        });
    });
});

module.exports = router;