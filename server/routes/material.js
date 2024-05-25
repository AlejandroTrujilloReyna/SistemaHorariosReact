const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarMaterial",(req,res)=>{
    const clave_Material = req.body.clave_Material;
    const nombre_Material = req.body.nombre_Material;
        
        db.query('SELECT * FROM material WHERE nombre_Material = ?',[nombre_Material], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre del Material ya existe");
            }

            db.query('INSERT INTO material(clave_Material, nombre_Material) VALUES (?, ?)',
            [clave_Material, nombre_Material], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Material registrado con éxito");
            });  
        });
    });

router.get("/consultarMaterial", (req, res) => {
    db.query('SELECT * FROM material ORDER BY clave_Material', (err, results) => {
        if (err) {
            console.log(err);
        return res.status(500).send("Error interno del servidor");
        }
    res.status(200).json(results);
  });
});

router.put("/modificarMaterial", (req, res) => {
    const clave_Material = req.body.clave_Material;
    const nombre_Material = req.body.nombre_Material;
    db.query('SELECT * FROM material WHERE nombre_Material = ? AND clave_Material != ? ',[nombre_Material, clave_Material], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del Material ya existe");
        }

        db.query('UPDATE material SET nombre_Material = ? WHERE clave_Material = ?',[nombre_Material,clave_Material],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
              }
            res.status(200).send("Material modificado con exito");        
        });
    });
});

module.exports = router;