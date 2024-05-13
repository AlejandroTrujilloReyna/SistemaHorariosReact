const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarHorarioActividad", (req, res) => {
    const hora_EntradaHActividad = req.body.hora_EntradaHActividad;
    const hora_SalidaHActividad = req.body.hora_SalidaHActividad;
    const clave_Dia = req.body.clave_Dia;
    const no_Empleado = req.body.no_Empleado;
    const id_Actividad = req.body.id_Actividad;

    if (hora_SalidaHActividad < hora_EntradaHActividad) {
        return res.status(401).send("La hora de salida debe ser posterior a la hora de entrada");
    }
    db.query('SELECT * FROM horarioactividad WHERE clave_Dia = ? AND no_Empleado = ? AND ((? >= hora_EntradaHActividad AND ? < hora_SalidaHActividad) OR (? > hora_EntradaHActividad AND ? <= hora_SalidaHActividad) OR (? <= hora_EntradaHActividad AND ? >= hora_SalidaHActividad))',
    [clave_Dia, no_Empleado, hora_EntradaHActividad, hora_EntradaHActividad, hora_SalidaHActividad, hora_SalidaHActividad, hora_EntradaHActividad, hora_SalidaHActividad], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(402).send("Ya existe un registro de eso");
        }
        db.query('INSERT INTO horarioactividad(hora_EntradaHActividad, hora_SalidaHActividad, clave_Dia, no_Empleado, id_Actividad) VALUES (?, ?, ?, ?, ?)',
        [hora_EntradaHActividad, hora_SalidaHActividad, clave_Dia, no_Empleado, id_Actividad], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Programa educativo registrado con éxito");
        });
    });      
});

router.get("/consultarHorarioActividad", (req, res) => {
    db.query('SELECT * FROM horarioactividad', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarHorarioActividad", (req, res) => {
    const clave_HorarioActividad = req.body.clave_HorarioActividad;
    const hora_EntradaHActividad = req.body.hora_EntradaHActividad;
    const hora_SalidaHActividad = req.body.hora_SalidaHActividad;
    const clave_Dia = req.body.clave_Dia;
    const no_Empleado = req.body.no_Empleado;
    const id_Actividad = req.body.id_Actividad;

    if (hora_SalidaHActividad < hora_EntradaHActividad) {
        return res.status(401).send("La hora de salida debe ser posterior a la hora de entrada");
    }
    db.query('SELECT * FROM horarioactividad WHERE clave_HorarioActividad != ? AND clave_Dia = ? AND no_Empleado = ? AND ((? >= hora_EntradaHActividad AND ? < hora_SalidaHActividad) OR (? > hora_EntradaHActividad AND ? <= hora_SalidaHActividad) OR (? <= hora_EntradaHActividad AND ? >= hora_SalidaHActividad))',
    [clave_Dia, no_Empleado, hora_EntradaHActividad, hora_EntradaHActividad, hora_SalidaHActividad, hora_SalidaHActividad, hora_EntradaHActividad, hora_SalidaHActividad, clave_HorarioActividad], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(402).send("Ya existe un registro de eso");
        }
        db.query('UPDATE horarioactividad SET hora_EntradaHActividad = ?, hora_SalidaHActividad = ?, clave_Dia = ?, no_Empleado = ?, id_Actividad = ? WHERE clave_HorarioActividad = ?',
        [hora_EntradaHActividad, hora_SalidaHActividad, clave_Dia, no_Empleado, id_Actividad, clave_HorarioActividad], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Programa educativo registrado con éxito");
        });
    });        
});

module.exports = router;