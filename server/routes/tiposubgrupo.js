const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarTipoSubGrupo", (req, res) => {
    const clave_TipoSubGrupo = req.body.clave_TipoSubGrupo;
    const nombre_TipoSubGrupo = req.body.nombre_TipoSubGrupo;

    db.query('SELECT * FROM tiposubgrupo WHERE nombre_TipoSubGrupo= ?',[nombre_TipoSubGrupo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del Tipo SubGrupo ya existe");
        }
        db.query('SELECT * FROM tiposubgrupo WHERE nombre_TipoSubGrupo = ?',[nombre_TipoSubGrupo], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre del Tipo SubGrupo ya existe");
            }
            
            db.query('INSERT INTO tiposubgrupo(clave_TipoSubGrupo, nombre_TipoSubGrupo) VALUES (?, ?)',
            [clave_TipoSubGrupo, nombre_TipoSubGrupo], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Tipo SubGrupo registrado con éxito");
            });  
        });  
    });
});

router.get("/consultarTipoSubGrupo", (req, res) => {
    db.query('SELECT * FROM tiposubgrupo ORDER BY clave_TipoSubGrupo', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarTipoSubGrupo", (req, res) => {
    const clave_TipoSubGrupo = req.body.clave_TipoSubGrupo;
    const nombre_TipoSubGrupo = req.body.nombre_TipoSubGrupo;

    db.query('SELECT * FROM tiposubgrupo WHERE nombre_TipoSubGrupo = ? AND clave_TipoSubGrupo != ?',[nombre_TipoSubGrupo,clave_TipoSubGrupo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre del Tipo SubGrupo ya existe");
        }
        db.query('UPDATE tiposubgrupo SET nombre_TipoSubGrupo = ?  WHERE clave_TipoSubGrupo = ?',
        [nombre_TipoSubGrupo, clave_TipoSubGrupo],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("SubGrupo modificado con exito");        
        });
    });    
});

module.exports = router;