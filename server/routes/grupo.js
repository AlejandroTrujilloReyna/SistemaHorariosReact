const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarGrupo", (req, res) => {
    const clave_Grupo = req.body.clave_Grupo;
    const nombre_Grupo = req.body.nombre_Grupo;
    const semestre = req.body.semestre;
    const clave_PlanEstudios = req.body.clave_PlanEstudios;
    const uso = req.body.uso;

    db.query('SELECT * FROM grupo WHERE clave_Grupo = ?',[clave_Grupo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave del Grupo ya existe");
        }
        db.query('SELECT * FROM grupo WHERE nombre_Grupo = ?',[nombre_Grupo], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre del Grupo ya existe");
            }
            
            db.query('INSERT INTO grupo (clave_Grupo, nombre_Grupo, semestre, clave_PlanEstudios, uso) VALUES (?, ?, ?, ?, ?)',
                [clave_Grupo,nombre_Grupo,semestre,clave_PlanEstudios, uso], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Grupo registrado con éxito");
            });
        });
    });

})

router.get("/consultarGrupo", (req, res) => {
    db.query('SELECT * FROM grupo ORDER BY clave_Grupo', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarGrupo", (req, res) => {
    const clave_Grupo = req.body.clave_Grupo;
    const nombre_Grupo = req.body.nombre_Grupo;
    const semestre = req.body.semestre;
    const clave_PlanEstudios = req.body.clave_PlanEstudios;
    const uso = req.body.uso;
    db.query('SELECT * FROM grupo WHERE nombre_Grupo = ? AND clave_Grupo != ?',[nombre_Grupo,clave_Grupo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del Grupo ya existe");
        }
        
        db.query('UPDATE grupo SET nombre_Grupo=?, semestre=?,clave_PlanEstudios=?, uso=? WHERE clave_Grupo=?',[nombre_Grupo,semestre,clave_PlanEstudios,uso, clave_Grupo],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Edificio modificado con exito");        
        });
    });
});

module.exports = router;