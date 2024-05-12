const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarDocente", (req, res) => {
    const no_EmpleadoDocente = req.body.no_EmpleadoDocente;
    const horas_MinimasDocente = parseInt(req.body.horas_MinimasDocente);
    const horas_MaximasDocente = parseInt(req.body.horas_MaximasDocente);    
    const horas_Externas = parseInt(req.body.horas_Externas);
    const clave_TipoEmpleado = req.body.clave_TipoEmpleado;
    const clave_GradoEstudio = req.body.clave_GradoEstudio;
    const clave_Usuario = req.body.clave_Usuario;

    db.query('SELECT * FROM docente WHERE no_EmpleadoDocente = ?',[no_EmpleadoDocente], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("El no.Empleado del Docente ya existe");
        }
        db.query('SELECT * FROM docente WHERE clave_Usuario = ?',[clave_Usuario], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }

            if(results.length > 0) {
                return res.status(405).send("Solo puede haber un usuario por docente");
            }
        
            if(horas_MinimasDocente > horas_MaximasDocente){
                return res.status(403).send("Hay error en las horas");
            }
            db.query('INSERT INTO docente (no_EmpleadoDocente, horas_MinimasDocente, horas_MaximasDocente, horas_Externas,clave_TipoEmpleado,clave_GradoEstudio,clave_Usuario) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [no_EmpleadoDocente,horas_MinimasDocente,horas_MaximasDocente,horas_Externas, clave_TipoEmpleado, clave_GradoEstudio, clave_Usuario], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Docente registrado con éxito");
            });        
        });
    });
});

router.get("/consultarDocente", (req, res) => {
    db.query('SELECT * FROM docente', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});


router.put("/modificarDocente", (req, res) => {
    const no_EmpleadoDocente = req.body.no_EmpleadoDocente;
    const horas_MinimasDocente = parseInt(req.body.horas_MinimasDocente);
    const horas_MaximasDocente = parseInt(req.body.horas_MaximasDocente);    
    const horas_Externas = parseInt(req.body.horas_Externas);
    const clave_TipoEmpleado = req.body.clave_TipoEmpleado;
    const clave_GradoEstudio = req.body.clave_GradoEstudio;
    const clave_Usuario = req.body.clave_Usuario;
      
    if(horas_MinimasDocente > horas_MaximasDocente){
        return res.status(403).send("Hay error en las horas");
    }
    db.query('SELECT * FROM docente WHERE clave_Usuario = ? AND no_EmpleadoDocente != ?',[clave_Usuario,no_EmpleadoDocente], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(405).send("Solo puede haber un usuario por docente");
        }
        db.query('UPDATE docente SET horas_MinimasDocente=?, horas_MaximasDocente=?,horas_Externas=?, clave_TipoEmpleado=?, clave_GradoEstudio=? WHERE no_EmpleadoDocente=?',
        [horas_MinimasDocente, horas_MaximasDocente, horas_Externas, clave_TipoEmpleado, clave_GradoEstudio, no_EmpleadoDocente],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Docente modificado con exito");        
        });
    });        
});

module.exports = router;