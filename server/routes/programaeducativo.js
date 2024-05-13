const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarProgramaEducativo", (req, res) => {
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;
    const nombre_ProgramaEducativo = req.body.nombre_ProgramaEducativo;
    const banco_Horas = req.body.banco_Horas;
    const asignaturas_horas = req.body.asignaturas_horas;
    const clave_UnidadAcademica = req.body.clave_UnidadAcademica;

    db.query('SELECT * FROM programaeducativo WHERE clave_ProgramaEducativo = ?',[clave_ProgramaEducativo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave del Programa Educativo ya existe");
        }
        db.query('SELECT * FROM programaeducativo WHERE nombre_ProgramaEducativo = ?',[nombre_ProgramaEducativo], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre del Programa Educativo ya existe");
            }
            
            db.query('INSERT INTO programaeducativo(clave_ProgramaEducativo, nombre_ProgramaEducativo, banco_Horas, asignaturas_horas, clave_UnidadAcademica) VALUES (?, ?, ?, ?, ?)',
            [clave_ProgramaEducativo, nombre_ProgramaEducativo, banco_Horas, asignaturas_horas, clave_UnidadAcademica], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Programa educativo registrado con éxito");
            });  
        });  
    });
});

router.get("/consultarProgramaEducativo", (req, res) => {
    db.query('SELECT * FROM programaeducativo ORDER BY clave_ProgramaEducativo', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarProgramaEducativo", (req, res) => {
    const clave_ProgramaEducativo = req.body.clave_ProgramaEducativo;
    const nombre_ProgramaEducativo = req.body.nombre_ProgramaEducativo;
    const banco_Horas = req.body.banco_Horas;
    const asignaturas_horas = req.body.asignaturas_horas;
    const clave_UnidadAcademica = req.body.clave_UnidadAcademica;
    db.query('SELECT * FROM programaeducativo WHERE nombre_ProgramaEducativo = ? AND clave_ProgramaEducativo != ?',[nombre_ProgramaEducativo,clave_ProgramaEducativo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre del Programa Educativo ya existe");
        }
        db.query('UPDATE programaeducativo SET nombre_ProgramaEducativo = ?, banco_Horas = ?, asignaturas_horas = ?, clave_UnidadAcademica = ?  WHERE clave_ProgramaEducativo = ?',
        [nombre_ProgramaEducativo,banco_Horas, asignaturas_horas,clave_UnidadAcademica,clave_ProgramaEducativo],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Programa Educativo modificado con exito");        
        });
    });    
});

module.exports = router;