const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});



router.post("/registrarUnidadAprendizajePlanEstudios",(req,res)=>{
    
    const clave_UnidadAprendizajePlanEstudios = req.body.clave_UnidadAprendizajePlanEstudios;
    const semestre = req.body.semestre;
    const clave_ClasificacionUnidadAprendizaje = req.body.clave_ClasificacionUnidadAprendizaje;
    const clave_Etapa = req.body.clave_Etapa;
    const clave_PlanEstudios = req.body.clave_PlanEstudios;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;

   
        db.query('INSERT INTO unidadaprendizajeplanestudios (semestre, clave_ClasificacionUnidadAprendizaje, clave_Etapa, clave_PlanEstudios, clave_UnidadAprendizaje ) VALUES (?, ?, ?, ?, ?)', 
        [semestre,clave_ClasificacionUnidadAprendizaje , clave_Etapa, clave_PlanEstudios, clave_UnidadAprendizaje], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("asignacion con exito e registro");
        });
    });

router.get("/consultarUnidadAprendizajePlanEstudios", (req, res) => {
    db.query('SELECT * FROM unidadaprendizajeplanestudios ORDER BY clave_UnidadAprendizajePlanEstudios', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarUnidadAprendizajePlanEstudios", (req, res) => {
    const clave_UnidadAprendizajePlanEstudios = req.body.clave_UnidadAprendizajePlanEstudios;
    const semestre = req.body.semestre;
    const clave_ClasificacionUnidadAprendizaje = req.body.clave_ClasificacionUnidadAprendizaje;
    const clave_Etapa = req.body.clave_Etapa;
    const clave_PlanEstudios = req.body.clave_PlanEstudios;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;

    db.query('UPDATE unidadaprendizajeplanestudios SET semestre = ?, clave_ClasificacionUnidadAprendizaje = ?, clave_Etapa = ?, clave_PlanEstudios = ?, clave_UnidadAprendizaje = ? WHERE clave_UnidadAprendizajePlanEstudios = ?',
        [semestre, clave_ClasificacionUnidadAprendizaje, clave_Etapa, clave_PlanEstudios, clave_UnidadAprendizaje, clave_UnidadAprendizajePlanEstudios],
        (err, result) => {
            if (err) {
                console.error("Error al actualizar la unidad de aprendizaje del plan de estudios:", err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Modificación con éxito");
        }
    );
});


module.exports = router;
