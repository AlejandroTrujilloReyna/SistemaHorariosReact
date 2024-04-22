const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemahorario"
});

router.post("/registrarUnidadAprendizaje",(req,res)=>{
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const nombre_UnidadAprendizaje = req.body.nombre_UnidadAprendizaje;
    const semestre = req.body.semestre;
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
         
            db.query('INSERT INTO unidadaprendizaje(clave_UnidadAprendizaje, nombre_UnidadAprendizaje, semestre, clave_PlanEstudios) VALUES (?, ?, ?, ?)',
            [clave_UnidadAprendizaje, nombre_UnidadAprendizaje,semestre,clave_PlanEstudios], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Unidad de aprendizaje registrada con éxito");
            });
        });    
    });
});


router.get("/consultarPlandeestudios", (req, res) => {
    db.query('SELECT * FROM plaestudios', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

/*
router.get("/unidadesAprendizajes", (req, res) => {
    db.query('SELECT clave_UnidadAprendizaje, nombre_UnidadAprendizaje, semestre, clave_PlanEstudios FROM unidadaprendizaje', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});
*/
module.exports = router;






/*const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemahorario"
});
//variables a usar para el registro de unidad de aprendizaje
router.post("/registrarUnidadAprendizaje",(req,res)=>{
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const nombre_UnidadAprendizaje = req.body.nombre_UnidadAprendizaje;
    const semestre = req.body.semestre;
    const clave_PlanEstudios = req.body.semestre;

    //seleccionar la clave unidad aprendizaje de la base de datos y verificar si ya hay una existente
    db.query('SELECT * FROM unidadaprendizaje WHERE clave_UnidadAprendizaje = ?',[clave_UnidadAprendizaje], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }    
//ingresar datos/variables a la base de datos
        db.query('INSERT INTO unidadaprendizaje(clave_UnidadAprendizaje, nombre_UnidadAprendizaje,semestre,clave_PlanEstudios) VALUES (?,?,?,?)',
        [clave_UnidadAprendizaje, nombre_UnidadAprendizaje,semestre,clave_PlanEstudios], (err, result) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Unidad de aprendizaje registrada con éxito");
        });    
    });
});

router.get("/unidadesAprendizaje", (req, res) => {
    db.query('SELECT clave_UnidadAcademica, nombre_UnidadAcademica,semestre,clave_PlanEstudios FROM unidadaprendizaje', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

module.exports = router;*/