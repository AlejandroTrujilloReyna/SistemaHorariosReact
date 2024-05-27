const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.get("/consultarClasificacionUnidadAprendizaje", (req, res) => {
    db.query('SELECT * FROM clasificacionunidadaprendizaje ORDER BY clave_ClasificacionUnidAdaprendizaje', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

module.exports = router;