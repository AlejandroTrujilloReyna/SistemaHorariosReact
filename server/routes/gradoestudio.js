const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarGradoEstudio",(req,res)=>{
    const clave_GradoEstudio = req.body.clave_GradoEstudio;
    const nombre_GradoEstudio = req.body.nombre_GradoEstudio;
    const horas_MinimasGradoEstudio = parseInt(req.body.horas_MinimasGradoEstudio);
    const horas_MaximasGradoEstudio = parseInt(req.body.horas_MaximasGradoEstudio);
  

    db.query('SELECT * FROM gradoestudio WHERE nombre_GradoEstudio = ?',[nombre_GradoEstudio], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del Grado de Estudio ya existe");
        }

        if(horas_MinimasGradoEstudio > horas_MaximasGradoEstudio){
            return res.status(403).send("Hay error en las horas");
        }
      
            db.query('INSERT INTO gradoestudio(clave_GradoEstudio, nombre_GradoEstudio, horas_MinimasGradoEstudio, horas_MaximasGradoEstudio) VALUES (?, ?, ?, ?)',
            [clave_GradoEstudio, nombre_GradoEstudio, horas_MinimasGradoEstudio, horas_MaximasGradoEstudio], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Grado de Estudio registrado con éxito");
            });
        });    
    });



router.get("/consultarGradoEstudio", (req, res) => {
    db.query('SELECT * FROM gradoestudio ORDER BY clave_GradoEstudio', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarGradoEstudio", (req, res) => {
    
    const clave_GradoEstudio = req.body.clave_GradoEstudio;
    const nombre_GradoEstudio = req.body.nombre_GradoEstudio;
    const horas_MinimasGradoEstudio = parseInt(req.body.horas_MinimasGradoEstudio);
    const horas_MaximasGradoEstudio = parseInt(req.body.horas_MaximasGradoEstudio);
  
    db.query('SELECT * FROM gradoestudio WHERE nombre_GradoEstudio = ? AND clave_GradoEstudio != ?',[nombre_GradoEstudio, clave_GradoEstudio], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El grado de estudio ya existe");
        }

        if(horas_MinimasGradoEstudio > horas_MaximasGradoEstudio){
            return res.status(403).send("Hay error en las horas");
        }
        db.query('UPDATE gradoestudio SET nombre_GradoEstudio = ?, horas_MinimasGradoEstudio = ?, horas_MaximasGradoEstudio = ? WHERE clave_GradoEstudio = ?',[ nombre_GradoEstudio, horas_MinimasGradoEstudio, horas_MaximasGradoEstudio, clave_GradoEstudio],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Grado de estudio modificado con exito");        
        }); 
    });
});
module.exports = router;