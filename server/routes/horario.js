const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarHorario", (req,res) =>{
    const clave_Horario = req.body.clave_Horario;
    const hora_Entrada = req.body.hora_Entrada;
    const hora_Salida = req.body.hora_Salida;
    const clave_Dia = req.body.clave_Dia;
    const clave_SubGrupo = req.body.clave_SubGrupo;
    const clave_Sala = req.body.clave_Sala;

    if (hora_Salida < hora_Entrada) {
        return res.status(401).send("La hora de salida debe ser posterior a la hora de entrada");
    }
    db.query('SELECT * FROM horario WHERE clave_SubGrupo = ? AND clave_Dia = ? AND clave_Sala = ? AND ((? >= hora_Entrada AND ? < hora_Salida) OR (? > hora_Entrada AND ? <= hora_Salida) OR (? <= hora_Entrada AND ? >= hora_Salida))',
    [clave_SubGrupo,clave_Dia,clave_Sala,hora_Entrada,hora_Salida,hora_Entrada,hora_Salida,hora_Entrada,hora_Salida],(err,results) =>{
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(402).send("Registro existente");
        }
        db.query('INSERT INTO horario(clave_Horario, hora_Entrada, hora_Salida, clave_Dia, clave_SubGrupo, clave_Sala) VALUES (?, ?, ?, ?, ?, ?)',
        [clave_Horario, hora_Entrada, hora_Salida, clave_Dia, clave_SubGrupo, clave_Sala], (err,result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Horario registrado con éxito");
        });                
    });
});

router.get("/consultarHorario", (req, res) => {
    db.query('SELECT * FROM horario ORDER BY clave_Horario', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarHorario", (req, res) => {
    const clave_Horario = req.body.clave_Horario;
    const hora_Entrada = req.body.hora_Entrada;
    const hora_Salida = req.body.hora_Salida;
    const clave_Dia = req.body.clave_Dia;
    const clave_SubGrupo = req.body.clave_SubGrupo;
    const clave_Sala = req.body.clave_Sala;
    if (hora_Salida < hora_Entrada) {
        return res.status(401).send("La hora de salida debe ser posterior a la hora de entrada");
    }
    db.query('SELECT * FROM horario WHERE clave_Horario != ? AND clave_SubGrupo = ? AND clave_Dia = ? AND clave_Sala = ? AND ((? >= hora_Entrada AND ? < hora_Salida) OR (? > hora_Entrada AND ? <= hora_Salida) OR (? <= hora_Entrada AND ? >= hora_Salida))',
    [clave_Horario,clave_SubGrupo,clave_Dia,clave_Sala,hora_Entrada,hora_Salida,hora_Entrada,hora_Salida,hora_Entrada,hora_Salida],(err,results) =>{
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(402).send("Registro existente");
        }    
        db.query('UPDATE horario SET hora_Entrada = ?, hora_Salida = ?, clave_Dia = ?, clave_SubGrupo = ?, clave_Sala = ? WHERE clave_Horario = ?',
        [hora_Entrada, hora_Salida, clave_Dia, clave_SubGrupo, clave_Sala,clave_Horario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Horario modificado con éxito");
        });
    });    
});


router.get("/CONSULTARSG", (req, res) => {
    db.query('SELECT * FROM subgrupo ORDER BY clave_SubGrupo', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

module.exports = router;