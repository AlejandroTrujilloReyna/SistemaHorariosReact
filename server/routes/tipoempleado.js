const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarTipoEmpleado",(req,res)=>{
    const clave_TipoEmpleado = req.body.clave_TipoEmpleado;
    const nombre_TipoEmpleado = req.body.nombre_TipoEmpleado;
    const horas_MinimasTipoEmpleado = parseInt(req.body.horas_MinimasTipoEmpleado);
    const horas_MaximasTipoEmpleado = parseInt(req.body.horas_MaximasTipoEmpleado);
  

    db.query('SELECT * FROM tipoempleado WHERE nombre_TipoEmpleado = ?',[nombre_TipoEmpleado], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del tipo empleado ya existe");
        }

        if(horas_MinimasTipoEmpleado > horas_MaximasTipoEmpleado){
            return res.status(403).send("Hay error en las horas");
        }

        db.query('INSERT INTO tipoempleado(clave_TipoEmpleado, nombre_TipoEmpleado, horas_MinimasTipoEmpleado, horas_MaximasTipoEmpleado) VALUES (?, ?, ?, ?)',
        [clave_TipoEmpleado, nombre_TipoEmpleado, horas_MinimasTipoEmpleado, horas_MaximasTipoEmpleado], (err, result) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Tipo de Empleado registrado con éxito");
        });
    });    
});


router.get("/consultarTipoEmpleado", (req, res) => {
    db.query('SELECT * FROM tipoempleado', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarTipoEmpleado", (req, res) => {
    const clave_TipoEmpleado = req.body.clave_TipoEmpleado;
    const nombre_TipoEmpleado = req.body.nombre_TipoEmpleado;
    const horas_MinimasTipoEmpleado = parseInt(req.body.horas_MinimasTipoEmpleado);
    const horas_MaximasTipoEmpleado = parseInt(req.body.horas_MaximasTipoEmpleado);
  
    db.query('SELECT * FROM tipoempleado WHERE nombre_TipoEmpleado = ? AND clave_TipoEmpleado != ?',[nombre_TipoEmpleado, clave_TipoEmpleado], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del Tipo de Empleado ya existe");
        }

        if(horas_MinimasTipoEmpleado > horas_MaximasTipoEmpleado){
            return res.status(403).send("Hay error en las horas");
        }
        
        db.query('UPDATE tipoempleado SET nombre_TipoEmpleado = ?, horas_MinimasTipoEmpleado = ?, horas_MaximasTipoEmpleado = ? WHERE clave_TipoEmpleado = ?',[nombre_TipoEmpleado, horas_MinimasTipoEmpleado, horas_MaximasTipoEmpleado,clave_TipoEmpleado],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Tipo de empleado modificado con exito");        
        }); 
    });
});
module.exports = router;