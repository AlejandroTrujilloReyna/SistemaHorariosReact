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
    const horas_MinimasGradoEstudio = req.body.horas_MinimasGradoEstudio;
    const horas_MaximasGradoEstudio = req.body.horas_MaximasGradoEstudio;
  

    db.query('SELECT * FROM gradoestudio WHERE nombre_GradoEstudio = ?',[nombre_GradoEstudio], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave del Grado de Estudio ya existe");
        }

       /* db.query('SELECT * FROM tipoempleado WHERE nombre_Un = ? AND clave_PlanEstudios = ?',[nombre_UnidadAprendizaje,clave_PlanEstudios], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre de la Unidad de Aprendizaje ya existe en el Plan de Estudios");
            }
         */
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
//});


router.get("/consultarGradoEstudio", (req, res) => {
    db.query('SELECT * FROM gradoestudio', (err, results) => {
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
    const horas_MinimasGradoEstudio = req.body.horas_MinimasGradoEstudio;
    const horas_MaximasGradoEstudio = req.body.horas_MaximasGradoEstudio;
  
    db.query('SELECT * FROM gradoestudio WHERE nombre_GradoEstudio = ? AND clave_GradoEstudio != ?',[nombre_GradoEstudio, clave_GradoEstudio], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El grado de estudio ya existe");
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