const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarUsarEdificio",(req,res)=>{

    const clave_UsarEdificio = req.body.clave_UsarEdificio;
    const clave_Edificio = req.body.clave_Edificio;
    const clave_ProgramaEducativo= req.body.clave_ProgramaEducativo;

    db.query('SELECT * FROM usaredificio WHERE clave_Edificio = ? AND clave_ProgramaEducativo = ?', 
    [clave_Edificio, clave_ProgramaEducativo], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if (results.length > 0) {
            return res.status(401).send("El programa educativo ya está asignado a este edificio");
       }

        db.query('INSERT INTO usaredificio (clave_Edificio, clave_ProgramaEducativo) VALUES (?, ?)', 
        [clave_Edificio, clave_ProgramaEducativo], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Programa educativo asignado con éxito");
        });
    });
});

router.get("/consultarUsarEdificio", (req, res) => {
    db.query('SELECT * FROM usaredificio ORDER BY clave_UsarEdificio', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});
    router.put("/modificarUsarEdificio", (req, res) => {
        const clave_UsarEdificio = req.body.clave_UsarEdificio;
        const clave_Edificio = req.body.clave_Edificio;
        const clave_ProgramaEducativo= req.body.clave_ProgramaEducativo;
        db.query('SELECT * FROM usaredificio WHERE clave_Edificio = ? AND clave_ProgramaEducativo = ? AND clave_UsarEdificio != ?',[clave_Edificio,clave_ProgramaEducativo,clave_UsarEdificio], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if (results.length > 0) {
                return res.status(401).send("El programa educativo ya está asignado a este edificio");
            }

      
            db.query('UPDATE usaredificio SET clave_Edificio = ?, clave_ProgramaEducativo = ? WHERE clave_UsarEdificio = ?',[clave_Edificio,clave_ProgramaEducativo, clave_UsarEdificio],(err,result) =>{
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("programa educativo asignado con exito");        
            }); 
        });
    });
    

    module.exports = router;
