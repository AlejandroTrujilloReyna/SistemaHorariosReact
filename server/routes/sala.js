const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bdsistemahorarios"
});

router.post("/registrarSala", (req, res) => {
    const clave_Sala = null;
    const nombre_Sala = req.body.nombre_Sala;
    const capacidad_Sala = req.body.capacidad_Sala;
    const validar_Traslape = req.body.validar_Traslape;
    const nota_Descriptiva = req.body.nota_Descriptiva;
    const clave_Edificio = req.body.clave_Edificio;
    const clave_TipoSala = req.body.clave_TipoSala;

    db.query('SELECT * FROM sala WHERE nombre_Sala = ? AND clave_Edificio = ?', [nombre_Sala, clave_Edificio], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if (results.length > 0) {
            return res.status(401).send("El Nombre de la Sala ya existe en el Edificio");
        }


        db.query('INSERT INTO sala(clave_Sala,nombre_Sala,capacidad_Sala,validar_Traslape,nota_Descriptiva,clave_Edificio,clave_TipoSala) VALUES (?,?,?,?,?,?,?)',
            [clave_Sala, nombre_Sala, capacidad_Sala, validar_Traslape, nota_Descriptiva, clave_Edificio, clave_TipoSala], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                const clave_Sala = result.insertId;

                res.status(200).json({ clave_Sala: clave_Sala, message:"Sala registrada con éxito"});
            });

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

router.get("/consultarSala", (req, res) => {//              en u.nombre_Material iba antes: u.clave_Material
    db.query(`SELECT  d.*, COALESCE(GROUP_CONCAT(DISTINCT u.nombre_Material SEPARATOR ", "), 'Ninguno') AS materiales FROM bdsistemahorarios.sala d LEFT JOIN bdsistemahorarios.salamaterial i ON d.clave_Sala = i.clave_Sala LEFT JOIN bdsistemahorarios.material u ON i.clave_Material = u.clave_Material GROUP BY d.clave_Sala ORDER BY d.clave_Sala`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).json(results);
        }
    );
});
router.put("/modificarSala", (req, res) => {
    const clave_Sala = req.body.clave_Sala;
    const nombre_Sala = req.body.nombre_Sala;
    const capacidad_Sala = req.body.capacidad_Sala;
    const validar_Traslape = req.body.validar_Traslape;
    const nota_Descriptiva = req.body.nota_Descriptiva;
    const clave_Edificio = req.body.clave_Edificio;
    const clave_TipoSala = req.body.clave_TipoSala;
    db.query('SELECT * FROM sala WHERE nombre_Sala = ? AND clave_Sala != ? AND clave_Edificio = ?', [nombre_Sala, clave_Sala, clave_Edificio], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if (results.length > 0) {
            return res.status(401).send("El Nombre de la Sala ya existe en el Edificio");
        }
        db.query('UPDATE sala SET nombre_Sala = ?, capacidad_Sala = ?, validar_Traslape = ?, nota_Descriptiva = ?, clave_Edificio = ?, clave_TipoSala = ?  WHERE clave_Sala = ?',
            [nombre_Sala, capacidad_Sala, validar_Traslape, nota_Descriptiva, clave_Edificio, clave_TipoSala, clave_Sala], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Sala modificada con exito");
            });
    });
});

router.delete("/eliminarSala/", (req, res) => {
    const { clave_Sala } = req.body;
    if (!clave_Sala) {
        return res.status(400).send("Clave de la sala es requerida");
    }
    console.error("sala: ",clave_Sala);
    db.query('DELETE FROM sala WHERE clave_Sala = ?',
        [clave_Sala], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Sala eliminada con exito");
        });
});

module.exports = router;