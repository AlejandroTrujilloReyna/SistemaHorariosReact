const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemahorario"
});

router.post("/registrarSala",(req,res)=>{
    const clave_Sala = req.body.clave_Sala;
    const nombre_Sala = req.body.nombre_Sala;
    const capacidad_Sala = req.body.capacidad_Sala;
    const validar_Traslape = req.body.validar_Traslape;
    const nota_Descriptiva = req.body.nota_Descriptiva;
    const clave_Edificio = req.body.clave_Edificio;
    const clave_TipoSala = req.body.clave_TipoSala;

    db.query('SELECT * FROM sala WHERE clave_Sala = ?', [clave_Sala], (err, results)=>{
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        
        if(results.length > 0) {
            return res.status(400).send("La clave de la Sala ya existe");
        }        
    });

    db.query('INSERT INTO sala(clave_Sala,nombre_Sala,capacidad_Sala,validar_Traslape,nota_Descriptiva,clave_Edificio,clave_TipoSala) VALUES (?,?,?,?,?,?,?)',
    [clave_Sala,nombre_Sala,capacidad_Sala,validar_Traslape,nota_Descriptiva,clave_Edificio,clave_TipoSala], (err,result)=>{
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("Sala registrada con éxito");        
    });
});

//MOVER CUANDO SE CREE LA PARTE DE TIPOSALA
router.get("/consultarTiposala", (req, res) => {
    db.query('SELECT * FROM tiposala', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.get("/consultarSala", (req, res) => {
    db.query('SELECT * FROM sala', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

module.exports = router;