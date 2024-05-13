const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarActividad",(req,res)=>{
    const clave_Actividad = req.body.clave_Actividad;
    const nombre_Actividad = req.body.nombre_Actividad;

    db.query('SELECT * FROM actividad WHERE clave_Actividad = ?', [clave_Actividad], (err, results)=>{
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }        
        if(results.length > 0) {
            return res.status(400).send("La clave ya existe");
        }
        db.query('SELECT * FROM actividad WHERE nombre_Actividad = ?', [nombre_Actividad], (err, results)=>{
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }            
            if(results.length > 0) {
                return res.status(401).send("El nombre ya existe");
            }                      
            db.query('INSERT INTO actividad(clave_Actividad,nombre_Actividad) VALUES (?,?)',
            [clave_Actividad, nombre_Actividad], (err,result)=>{
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Usuario registrado con éxito");        
            });
        });    
    });
});

router.get("/consultarActividad", (req, res) => {
    db.query('SELECT * FROM actividad', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarActividad", (req, res) => {
    const id_Actividad = req.body.id_Actividad;
    const clave_Actividad = req.body.clave_Actividad;
    const nombre_Actividad = req.body.nombre_Actividad;
    db.query('SELECT * FROM actividad WHERE clave_Actividad = ? AND id_Actividad != ?', [clave_Actividad,id_Actividad], (err, results)=>{
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }        
        if(results.length > 0) {
            return res.status(400).send("La clave ya existe");
        }
        db.query('SELECT * FROM actividad WHERE nombre_Actividad = ? AND id_Actividad != ?', [nombre_Actividad, id_Actividad], (err, results)=>{
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }            
            if(results.length > 0) {
                return res.status(401).send("El nombre ya existe");
            }      
            db.query('UPDATE actividad SET clave_Actividad = ?, nombre_Actividad = ? WHERE id_Actividad = ?',[clave_Actividad,nombre_Actividad,id_Actividad],(err,result) =>{
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Unidad Academica modificada con exito"); 
            });
        });
    });     
});    

module.exports = router;