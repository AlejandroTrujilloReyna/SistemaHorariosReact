const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarUsuario",(req,res)=>{
    const clave_Usuario = req.body.clave_Usuario;
    const nombre_Usuario = req.body.nombre_Usuario;
    const apellidoP_Usuario = req.body.apellidoP_Usuario;
    const apellidoM_Usuario = req.body.apellidoM_Usuario;    
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    const clave_Permiso = req.body.clave_Permiso;

    db.query('SELECT * FROM usuario WHERE correo = ?', [correo], (err, results)=>{
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        
        if(results.length > 0) {
            return res.status(401).send("El Correo ya existe");
        }        

        db.query('INSERT INTO usuario(clave_Usuario,nombre_Usuario,apellidoP_Usuario,apellidoM_Usuario,correo, contrasena,clave_Permiso) VALUES (?,?,?,?,?,?,?)',
        [clave_Usuario, nombre_Usuario, apellidoP_Usuario, apellidoM_Usuario, correo, contrasena, clave_Permiso], (err,result)=>{
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Usuario registrado con éxito");        
        });

     });
});

router.get("/consultarUsuario", (req, res) => {
    db.query('SELECT * FROM usuario ORDER BY clave_Usuario', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarUsuario", (req, res) => {
    const clave_Usuario = req.body.clave_Usuario;
    const nombre_Usuario = req.body.nombre_Usuario;
    const apellidoP_Usuario = req.body.apellidoP_Usuario;
    const apellidoM_Usuario = req.body.apellidoM_Usuario;    
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    const clave_Permiso = req.body.clave_Permiso;
    db.query('SELECT * FROM usuario WHERE correo = ? AND clave_Usuario != ?',[correo,clave_Usuario], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Correo ya existe");
        }
        db.query('UPDATE usuario SET nombre_Usuario = ?, apellidoP_Usuario = ?, apellidoM_Usuario = ?, correo = ?, contrasena = ?, clave_Permiso = ?  WHERE clave_Usuario = ?',
        [nombre_Usuario,apellidoP_Usuario,apellidoM_Usuario,correo,contrasena,clave_Permiso,clave_Usuario],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Usuario modificado con exito");        
        });
    });    
});

module.exports = router;