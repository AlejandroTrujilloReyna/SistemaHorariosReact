const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bdsistemahorarios"
});

router.post("/registrarSalaMaterial", (req, res) => {
    const clave_SalaMaterial = req.body.clave_SalaMaterial;
    const cantidad_Material = req.body.cantidad_Material;
    const clave_Sala = req.body.clave_Sala;
    const clave_Material = req.body.clave_Material

    db.query('SELECT * FROM salamaterial WHERE clave_Material = ? AND clave_Sala = ?', [clave_Material, clave_Sala], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if (results.length > 0) {
            return res.status(401).send("El Material ya existe en la Sala");
        }


        db.query('INSERT INTO salamaterial(clave_SalaMaterial, cantidad_Material, clave_Sala, clave_Material) VALUES (?,?,?,?)',
            [clave_SalaMaterial, cantidad_Material, clave_Sala, clave_Material], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Sala registrada con éxito");
            });

    });
});

//MOVER CUANDO SE CREE LA PARTE DE TIPOSALA
router.get("/consultarSalaMaterial", (req, res) => {
    db.query('SELECT * FROM salamaterial', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.get("/consultarSala", (req, res) => {
    db.query('SELECT * FROM sala ORDER BY clave_Sala', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.get("/consultarMaterial", (req, res) => {
    db.query('SELECT * FROM material ORDER BY clave_Material', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarSalaMaterial", (req, res) => {
    const clave_SalaMaterial = req.body.clave_SalaMaterial;
    const cantidad_Material = req.body.cantidad_Material;
    const clave_Sala = req.body.clave_Sala;
    const clave_Material = req.body.clave_Material

    db.query('SELECT * FROM salamaterial WHERE clave_Material = ? AND clave_Sala = ?', [clave_Material, clave_Sala], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if (results.length > 0) {
            return res.status(401).send("El Nombre del Material ya existe en la Sala");
        }
        db.query('UPDATE salamaterial SET cantidad_Material = ?, clave_Sala = ?, clave_Material = ?  WHERE clave_SalaMaterial = ?',
            [cantidad_Material, clave_Sala, clave_Material, clave_SalaMaterial], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Sala Material modificada con exito");
        });
    });
});

router.delete("/eliminarSalaMaterial/", (req, res) => {
    const { clave_SalaMaterial } = req.body;
    if (!clave_SalaMaterial) {
        return res.status(400).send("Clave de la sala material es requerida");
    }
    console.error("Sala Material: ",clave_SalaMaterial);
    db.query('DELETE FROM salamaterial WHERE clave_SalaMaterial = ?',
        [clave_SalaMaterial], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Sala Material eliminada con exito");
        });
});

module.exports = router;