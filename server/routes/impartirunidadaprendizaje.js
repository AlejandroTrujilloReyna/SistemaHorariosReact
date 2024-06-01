const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});


/*router.post("/registrarImpartirUnidadAprendizaje",(req,res)=>{
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
});*/

// Registro de Unidades de Aprendizaje a Impartir
router.post("/registrarUnidadesAprendizaje", (req, res) => {
    const { no_EmpleadoDocente, unidades_aprendizaje } = req.body;

    if (!Array.isArray(unidades_aprendizaje)) {
        return res.status(400).json({ error: "Datos de entrada incorrectos" });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        unidades_aprendizaje.forEach(clave_UnidadAprendizaje => {
            db.query('INSERT INTO impartirunidadaprendizaje (no_EmpleadoDocente, clave_UnidadAprendizaje) VALUES (?, ?)',
                [no_EmpleadoDocente, clave_UnidadAprendizaje], (err, result) => {
                    if (err) {
                        console.error("Error inserting impartirunidadaprendizaje:", err);
                        return db.rollback(() => {
                            res.status(500).json({ error: "Error interno del servidor" });
                        });
                    }
                });
        });

        db.commit(err => {
            if (err) {
                console.error("Error committing transaction:", err);
                return db.rollback(() => {
                    res.status(500).json({ error: "Error interno del servidor" });
                });
            }
            res.status(200).json({ message: "Éxito en registrar unidades de aprendizaje" });
        });
    });
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

    db.query('SELECT * FROM impartirunidadaprendizaje WHERE no_EmpleadoDocente = ? AND clave_UnidadAprendizaje = ?',[no_EmpleadoDocente,clave_UnidadAprendizaje], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La Unidad de Aprendizaje ya se encuentra asignada");
        }
        db.query('INSERT INTO impartirunidadaprendizaje (clave_ImpartirUnidadAprendizaje, no_EmpleadoDocente, clave_UnidadAprendizaje) VALUES (?, ?, ?)',
            [null,no_EmpleadoDocente,clave_UnidadAprendizaje], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
            res.status(200).send("Exito en imparir unidad aprendizaje");
        });        
    }); 
});

// Modificación de Unidades de Aprendizaje a Impartir
router.put("/modificarUnidadesAprendizaje", (req, res) => {
    const { no_EmpleadoDocente, nuevas_unidades_aprendizaje } = req.body;

    if (!Array.isArray(nuevas_unidades_aprendizaje)) {
        return res.status(400).json({ error: "Datos de entrada incorrectos" });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        db.query('DELETE FROM impartirunidadaprendizaje WHERE no_EmpleadoDocente = ?', [no_EmpleadoDocente], (err, result) => {
            if (err) {
                console.error("Error deleting impartirunidadaprendizaje:", err);
                return db.rollback(() => {
                    res.status(500).json({ error: "Error interno del servidor" });
                });
            }

            nuevas_unidades_aprendizaje.forEach(clave_UnidadAprendizaje => {
                db.query('INSERT INTO impartirunidadaprendizaje (no_EmpleadoDocente, clave_UnidadAprendizaje) VALUES (?, ?)',
                    [no_EmpleadoDocente, clave_UnidadAprendizaje], (err, result) => {
                        if (err) {
                            console.error("Error inserting impartirunidadaprendizaje:", err);
                            return db.rollback(() => {
                                res.status(500).json({ error: "Error interno del servidor" });
                            });
                        }
                    });
            });

            db.commit(err => {
                if (err) {
                    console.error("Error committing transaction:", err);
                    return db.rollback(() => {
                        res.status(500).json({ error: "Error interno del servidor" });
                    });
                }
                res.status(200).json({ message: "Éxito en modificar unidades de aprendizaje" });
            });
        });
    });
});


module.exports = router;