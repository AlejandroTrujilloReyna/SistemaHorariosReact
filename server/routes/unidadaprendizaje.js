const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarUnidadAprendizaje",(req,res)=>{
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const nombre_UnidadAprendizaje = req.body.nombre_UnidadAprendizaje;
    const clave_PlanEstudios = req.body.clave_PlanEstudios;

    db.query('SELECT * FROM unidadaprendizaje WHERE clave_UnidadAprendizaje = ?',[clave_UnidadAprendizaje], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave de la Unidad de Aprendizaje ya existe");
        }

        db.query('SELECT * FROM unidadaprendizaje WHERE nombre_UnidadAprendizaje = ? AND clave_PlanEstudios = ?',[nombre_UnidadAprendizaje,clave_PlanEstudios], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre de la Unidad de Aprendizaje ya existe en el Plan de Estudios");
            }
         
            db.query('INSERT INTO unidadaprendizaje(clave_UnidadAprendizaje, nombre_UnidadAprendizaje, clave_PlanEstudios) VALUES (?, ?, ?)',
            [clave_UnidadAprendizaje, nombre_UnidadAprendizaje,clave_PlanEstudios], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Unidad de aprendizaje registrada con éxito");
            });
        });    
    });
});

//MOVER CUANDO SE CREE LA PARTE DE PLAN DE ESTUDIOS
router.get("/consultarPlandeestudios", (req, res) => {
    db.query('SELECT * FROM planestudios', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.get("/consultarUnidadAprendizaje", (req, res) => {
    db.query('SELECT * FROM unidadaprendizaje ORDER BY clave_UnidadAprendizaje', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarUnidadAprendizaje", (req, res) => {
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const nombre_UnidadAprendizaje = req.body.nombre_UnidadAprendizaje;
    const clave_PlanEstudios = req.body.clave_PlanEstudios;
    db.query('SELECT * FROM unidadaprendizaje WHERE nombre_UnidadAprendizaje = ? AND clave_PlanEstudios = ? AND clave_UnidadAprendizaje != ?',[nombre_UnidadAprendizaje,clave_PlanEstudios,clave_UnidadAprendizaje], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre de la Unidad de Aprendizaje ya existe en el Plan de Estudios");
        }
        db.query('UPDATE unidadaprendizaje SET nombre_UnidadAprendizaje = ?, clave_PlanEstudios = ? WHERE clave_UnidadAprendizaje = ?',[nombre_UnidadAprendizaje,clave_PlanEstudios,clave_UnidadAprendizaje],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Unidad Academica modificada con exito");        
        }); 
    });
});



module.exports = router;