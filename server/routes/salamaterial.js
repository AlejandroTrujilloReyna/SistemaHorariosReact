const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});


router.post("/registrarSalaMaterial",(req,res)=>{
    const clave_Sala = req.body.clave_Sala;
    const materiales = req.body.materiales;

    if (!Array.isArray(materiales)) {
        return res.status(400).send("Datos de entrada incorrectos");
    }
    
    materiales.forEach(clave_Material => {                   
        db.query('INSERT INTO salamaterial (clave_SalaMaterial, cantidad_Material, clave_Sala, clave_Material) VALUES (?, ?, ?, ?)',
            [null,cantidad_Material,clave_Sala, clave_Material], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }                
        });            
    });
    res.status(200).send("Exito en imparir unidad aprendizaje");
});


router.delete("/eliminarSalaMaterial", (req, res) => {
    const { clave_Sala } = req.body;         
    db.query('DELETE FROM salamaterial WHERE clave_Sala = ?',
        [clave_Sala], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("salamaterial eliminada con exito");
    });
});

router.post("/registrarSalaMaterialdos",(req,res)=>{
    const clave_Sala = req.body.clave_Sala;
    const clave_Material = req.body.clave_Material;

    db.query('INSERT INTO salamaterial (clave_SalaMaterial, cantidad_Material, clave_Sala, clave_Material) VALUES (?, ?, ?, ?)',
        [null,cantidad_Material,clave_Sala, clave_Material], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
        res.status(200).send("Exito en impartir material");
    });        
});


module.exports = router;