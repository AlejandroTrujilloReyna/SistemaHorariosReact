const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});


router.post("/registrarImpartirUnidadAprendizaje",(req,res)=>{
    const no_EmpleadoDocente = req.body.no_EmpleadoDocente;
    const unidades_aprendizaje = req.body.unidades_aprendizaje;

    if (!Array.isArray(unidades_aprendizaje)) {
        return res.status(400).send("Datos de entrada incorrectos");
    }
    
    unidades_aprendizaje.forEach(clave_UnidadAprendizaje => {                   
        db.query('INSERT INTO impartirunidadaprendizaje (clave_ImpartirUnidadAprendizaje, no_EmpleadoDocente, clave_UnidadAprendizaje) VALUES (?, ?, ?)',
            [null,no_EmpleadoDocente,clave_UnidadAprendizaje], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }                
        });            
    });
    res.status(200).send("Exito en imparir unidad aprendizaje");
});


router.delete("/eliminarImpartirUnidadAprendizaje", (req, res) => {
    const { no_EmpleadoDocente } = req.body;         
    db.query('DELETE FROM impartirunidadaprendizaje WHERE no_EmpleadoDocente = ?',
        [no_EmpleadoDocente], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("impartirunidadaprendizaje eliminada con exito");
    });
});

router.post("/registrarImpartirUnidadAprendizajedos",(req,res)=>{
    const no_EmpleadoDocente = req.body.no_EmpleadoDocente;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;

    db.query('INSERT INTO impartirunidadaprendizaje (clave_ImpartirUnidadAprendizaje, no_EmpleadoDocente, clave_UnidadAprendizaje) VALUES (?, ?, ?)',
        [null,no_EmpleadoDocente,clave_UnidadAprendizaje], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
        res.status(200).send("Exito en imparir unidad aprendizaje");
    });        
});


module.exports = router;