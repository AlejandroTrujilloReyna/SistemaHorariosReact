const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bdsistemahorarios"
});

router.post("/registrarSubGrupo", (req, res) => {
    
    const clave_SubGrupo = req.body.clave_SubGrupo;
    const no_SubGrupo = req.body.no_SubGrupo;
    const capacidad_SubGrupo = req.body.capacidad_SubGrupo;
    const horas_Asignadas = req.body.horas_Asignadas;
    const clave_Grupo = req.body.clave_Grupo;
    const no_Empleado_Docente = req.body.no_Empleado_Docente;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const clave_TipoSubGrupo = req.body.clave_TipoSubGrupo;

        db.query('INSERT INTO subgrupo(  no_SubGrupo, capacidad_SubGrupo, horas_Asignadas,clave_Grupo, no_Empleado_Docente, clave_UnidadAprendizaje, clave_TipoSubGrupo ) VALUES (?,?,?,?,?,?,?)',
            [no_SubGrupo, capacidad_SubGrupo, horas_Asignadas,clave_Grupo, no_Empleado_Docente, clave_UnidadAprendizaje, clave_TipoSubGrupo ], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("SubGrupo registrado con éxito");
            });

    });
//});
//Servidor: Consulta de los SubGrupos al momento de registrarlos
router.get("/consultarSubGrupo", (req, res) => {
db.query('SELECT * FROM subgrupo ORDER BY clave_Grupo', (err, results) => {
    if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.get("/consultarGrupo", (req, res) => {
    db.query('SELECT * FROM grupo ORDER BY clave_Grupo', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarSubGrupo", (req, res) => {
    const clave_SubGrupo = req.body.clave_SubGrupo;
    const no_SubGrupo = req.body.no_SubGrupo;
    const capacidad_SubGrupo = req.body.capacidad_SubGrupo;
    const horas_Asignadas = req.body.horas_Asignadas;
    const clave_Grupo = req.body.clave_Grupo;
    const no_Empleado_Docente = req.body.no_Empleado_Docente;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje
    const clave_TipoSubGrupo = req.body.clave_TipoSubGrupo;
   
        db.query('UPDATE subgrupo SET no_SubGrupo = ?, capacidad_SubGrupo = ?, horas_Asignadas = ?, clave_Grupo = ?, no_Empleado_Docente = ?, clave_UnidadAprendizaje = ?, clave_TipoSubGrupo = ? WHERE clave_SubGrupo = ?',
        [no_SubGrupo, capacidad_SubGrupo, horas_Asignadas, clave_Grupo, no_Empleado_Docente, clave_UnidadAprendizaje, clave_TipoSubGrupo,clave_SubGrupo, ],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Programa Educativo modificado con exito");        
        });
    });    

  
    
module.exports = router;