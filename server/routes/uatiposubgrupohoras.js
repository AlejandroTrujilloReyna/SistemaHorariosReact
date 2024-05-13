const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarUATipoSubGrupoHoras", (req, res) => {
    const clave_UATipoSubGrupoHoras = req.body.clave_UATipoSubGrupoHoras;
    const horas = req.body.horas;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const clave_TipoSubGrupo = req.body.clave_TipoSubGrupo;

    
        db.query('SELECT * FROM uatiposubgrupohoras WHERE clave_UnidadAprendizaje = ? AND clave_TipoSubGrupo = ?',[clave_UnidadAprendizaje, clave_TipoSubGrupo], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("Tipo de subgrupo existente en la Unidad de Aprendizaje");
            }
            db.query('INSERT INTO uatiposubgrupohoras(clave_UATipoSubGrupoHoras, horas, clave_UnidadAprendizaje, clave_TipoSubGrupo) VALUES (?, ?, ?, ?)',
            [clave_UATipoSubGrupoHoras, horas, clave_UnidadAprendizaje, clave_TipoSubGrupo], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("SubGrupo registrado con éxito");
            });
        });      
    
});

router.get("/consultarUATipoSubGrupoHoras", (req, res) => {
    db.query('SELECT * FROM uatiposubgrupohoras ORDER BY clave_UATipoSubGrupoHoras', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarUATipoSubGrupoHoras", (req, res) => {
    const clave_UATipoSubGrupoHoras = req.body.clave_UATipoSubGrupoHoras;
    const horas = req.body.horas;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const clave_TipoSubGrupo = req.body.clave_TipoSubGrupo;
    db.query('SELECT * FROM uatiposubgrupohoras WHERE clave_UnidadAprendizaje = ? AND clave_TipoSubGrupo = ? AND clave_UATipoSubGrupoHoras != ?',[clave_UnidadAprendizaje,clave_TipoSubGrupo,clave_UATipoSubGrupoHoras], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("Tipo de subgrupo existente en el programa educativo");
        }
        db.query('UPDATE uatiposubgrupohoras SET horas = ?, clave_UnidadAprendizaje = ?, clave_TipoSubGrupo = ?  WHERE clave_UATipoSubGrupoHoras = ?',
        [horas, clave_UnidadAprendizaje,clave_TipoSubGrupo,clave_UATipoSubGrupoHoras],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("SubGrupo modificado con exito");        
        });
    });    
});

module.exports = router;