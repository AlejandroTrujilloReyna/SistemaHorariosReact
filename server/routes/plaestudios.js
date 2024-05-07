const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarPlaEstudios", (req, res) => {
    const clave_PlanEstudios = req.body.clave_PlanEstudios;
    const nombre_PlanEstudios = req.body.nombre_PlanEstudios;
    const cant_semestres = req.body.cant_semestres;
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;
    

    db.query('SELECT * FROM planestudios WHERE nombre_PlanEstudios = ? AND clave_ProgramaEducativo = ?',[nombre_PlanEstudios,clave_ProgramaEducativo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("El Nombre del Plan de Estudios ya existe para este Programa Educativo");
        }
        
            
            db.query('INSERT INTO planestudios(clave_PlanEstudios, nombre_PlanEstudios, cant_semestres, clave_ProgramaEducativo) VALUES (?, ?, ?, ?)',
            [clave_PlanEstudios, nombre_PlanEstudios, cant_semestres, clave_ProgramaEducativo], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Plan de Estudios registrado con éxito");
            });  
          
    });
});
//MOVER CUANDO SE CREE LA PARTE DE PLAN DE ESTUDIOS
router.get("/consultarPlaEstudios", (req, res) => {
    db.query('SELECT * FROM planestudios', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarPlaEstudios", (req, res) => {
    const clave_PlanEstudios = req.body.clave_PlanEstudios;
    const nombre_PlanEstudios = req.body.nombre_PlanEstudios;
    const cant_semestres = req.body.cant_semestres;
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;
    
    db.query('SELECT * FROM planestudios WHERE nombre_PlanEstudios = ? AND clave_ProgramaEducativo = ? AND clave_PlanEstudios != ?',[nombre_PlanEstudios,clave_ProgramaEducativo,clave_PlanEstudios], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del Programa educativo ya existe en el Plan de Estudios");
        }
        db.query('UPDATE planestudios SET nombre_PlanEstudios = ?, cant_semestres = ?, clave_ProgramaEducativo = ? WHERE clave_PlanEstudios= ?',[nombre_PlanEstudios,cant_semestres,clave_ProgramaEducativo,clave_PlanEstudios],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Plan de estudios modificada con exito");        
        }); 
    });
});


module.exports = router;