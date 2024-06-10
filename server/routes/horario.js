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

router.get("/consultaCompletaHorario", (req, res) => {
    db.query('SELECT h.* ,s.*,sal.*, tsp.nombre_TipoSubGrupo, CONCAT(s.no_Empleado_Docente, " - ", u.nombre_Usuario," ", u.apellidoP_Usuario, " ", u.apellidoM_Usuario) AS docente, CONCAT(s.clave_UnidadAprendizaje, " - ", ua.nombre_UnidadAprendizaje) AS unidadAprendizaje FROM horario AS h LEFT JOIN subgrupo AS s ON s.clave_SubGrupo = h.clave_SubGrupo LEFT JOIN docente AS d ON s.no_Empleado_Docente = d.no_EmpleadoDocente LEFT JOIN usuario AS u ON d.clave_Usuario = u.clave_Usuario LEFT JOIN tiposubgrupo AS tsp ON s.clave_TipoSubGrupo = tsp.clave_TipoSubGrupo LEFT JOIN unidadaprendizaje AS ua ON s.clave_UnidadAprendizaje = ua.clave_UnidadAprendizaje LEFT JOIN sala AS sal ON h.clave_Sala = sal.clave_Sala', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.post("/registrarHorarioYSubGrupo", (req, res) => {
    
    const hora_Entrada = req.body.hora_Entrada;
    const hora_Salida = req.body.hora_Salida;
    const clave_Dia = req.body.clave_Dia;
    const clave_Sala = req.body.clave_Sala;
    const no_SubGrupo = req.body.no_SubGrupo;
    const capacidad_SubGrupo = req.body.capacidad_SubGrupo;
    const horas_Asignadas=0;
    const clave_Grupo = req.body.clave_Grupo;
    const no_Empleado_Docente = req.body.no_Empleado_Docente;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const clave_TipoSubGrupo = req.body.clave_TipoSubGrupo;
    

    if (hora_Salida < hora_Entrada) {
        return res.status(401).send("La hora de salida debe ser posterior a la hora de entrada");
    }
        
    if(!hora_Entrada || !hora_Salida || !clave_Dia || !clave_Sala || !capacidad_SubGrupo || !clave_Grupo || !no_Empleado_Docente || !clave_UnidadAprendizaje || !clave_TipoSubGrupo){
        console.error("DATOS: " + hora_Entrada + ", " + hora_Salida + "," + clave_Dia + ", " +  clave_Sala + ", " +  capacidad_SubGrupo + ", " +  horas_Asignadas + ", " +  clave_Grupo + ", " +  no_Empleado_Docente + ", " +  clave_UnidadAprendizaje + ", " +  clave_TipoSubGrupo);
        return res.status(501).send("Campo vacio");
    }
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).send("Error interno del servidor");
        }

        db.query('SELECT * FROM horario WHERE clave_Dia = ? AND clave_Sala = ? AND ((? >= hora_Entrada AND ? < hora_Salida) OR (? > hora_Entrada AND ? <= hora_Salida) OR (? <= hora_Entrada AND ? >= hora_Salida))',
            [clave_Dia, clave_Sala, hora_Entrada, hora_Salida, hora_Entrada, hora_Salida, hora_Entrada, hora_Salida], (err, results) => {
                console.error("ENTRO");
                if (err) {
                    console.error(err);
                    return db.rollback(() => {
                        res.status(500).send("Error interno del servidor");
                    });
                }
                
                if (results.length > 0) {
                    return db.rollback(() => {
                        res.status(402).send("Registro existente");
                    });
                }
                console.error("no: "+no_SubGrupo);
                db.query('INSERT INTO subgrupo(clave_SubGrupo, no_SubGrupo, capacidad_SubGrupo, horas_Asignadas, clave_Grupo, no_Empleado_Docente, clave_UnidadAprendizaje, clave_TipoSubGrupo) VALUES (?,?, ?, ?, ?, ?, ?, ?)',
                    [null, no_SubGrupo, capacidad_SubGrupo, horas_Asignadas, clave_Grupo, no_Empleado_Docente, clave_UnidadAprendizaje, clave_TipoSubGrupo], (err, result) => {
                        console.error("DATOS: " + hora_Entrada + ", " + hora_Salida + "," + clave_Dia + ", " +  clave_Sala + ", " +  capacidad_SubGrupo + ", " +  horas_Asignadas + ", " +  clave_Grupo + ", " +  no_Empleado_Docente + ", " +  clave_UnidadAprendizaje + ", " +  clave_TipoSubGrupo);
                        if (err) {
                            console.error(err);
                            return db.rollback(() => {
                                res.status(500).send("Error interno del servidor");
                            });
                        }
                        
                        const clave_SubGrupo = result.insertId; // Obtener el ID autoincremental generado

                        db.query('INSERT INTO horario(hora_Entrada, hora_Salida, clave_Dia, clave_SubGrupo, clave_Sala) VALUES (?, ?, ?, ?, ?)',
                            [hora_Entrada, hora_Salida, clave_Dia, clave_SubGrupo, clave_Sala], (err, result) => {
                                if (err) {
                                    console.error(err);
                                    return db.rollback(() => {
                                        res.status(500).send("Error interno del servidor");
                                    });
                                }

                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("Error al confirmar la transacción:", err);
                                            res.status(500).send("Error interno del servidor");
                                        });
                                    }

                                    res.status(200).send("Horario y SubGrupo registrados con éxito");
                                });
                            });
                    });
            });
    });
});

router.put("/modificarHorarioYSubGrupo", (req, res) => {
    
    const clave_Horario = req.body.clave_Horario;
    const clave_SubGrupo = req.body.clave_SubGrupo;
    const hora_Entrada = req.body.hora_Entrada;
    const hora_Salida = req.body.hora_Salida;
    const clave_Dia = req.body.clave_Dia;
    const clave_Sala = req.body.clave_Sala;
    const no_SubGrupo = req.body.no_SubGrupo;
    const capacidad_SubGrupo = req.body.capacidad_SubGrupo;
    const horas_Asignadas=0;
    const clave_Grupo = req.body.clave_Grupo;
    const no_Empleado_Docente = req.body.no_Empleado_Docente;
    const clave_UnidadAprendizaje = req.body.clave_UnidadAprendizaje;
    const clave_TipoSubGrupo = req.body.clave_TipoSubGrupo;
    
    

    if (hora_Salida < hora_Entrada) {
        return res.status(401).send("La hora de salida debe ser posterior a la hora de entrada");
    }
        
    if(!clave_Horario || !clave_SubGrupo || !hora_Entrada || !hora_Salida || !clave_Dia || !clave_Sala || !capacidad_SubGrupo || !clave_Grupo || !no_Empleado_Docente || !clave_UnidadAprendizaje || !clave_TipoSubGrupo){
        console.error("DATOS: " + hora_Entrada + ", " + hora_Salida + "," + clave_Dia + ", " +  clave_Sala + ", " +  capacidad_SubGrupo + ", " +  horas_Asignadas + ", " +  clave_Grupo + ", " +  no_Empleado_Docente + ", " +  clave_UnidadAprendizaje + ", " +  clave_TipoSubGrupo);
        return res.status(501).send("Campo vacio");
    }
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).send("Error interno del servidor");
        }

        db.query('UPDATE subgrupo SET no_SubGrupo = ?, capacidad_SubGrupo = ?, horas_Asignadas = ?, clave_Grupo = ?, no_Empleado_Docente = ?, clave_UnidadAprendizaje = ?, clave_TipoSubGrupo = ? WHERE clave_SubGrupo = ?',
            [no_SubGrupo, capacidad_SubGrupo, horas_Asignadas, clave_Grupo, no_Empleado_Docente, clave_UnidadAprendizaje, clave_TipoSubGrupo,clave_SubGrupo], (err, result) => {
                console.error("DATOS: " + hora_Entrada + ", " + hora_Salida + "," + clave_Dia + ", " + clave_Sala + ", " + capacidad_SubGrupo + ", " + horas_Asignadas + ", " + clave_Grupo + ", " + no_Empleado_Docente + ", " + clave_UnidadAprendizaje + ", " + clave_TipoSubGrupo + ", "+clave_SubGrupo);
                if (err) {
                    console.error(err);
                    return db.rollback(() => {
                        res.status(500).send("Error interno del servidor");
                    });
                }                

                db.query('UPDATE horario SET hora_Entrada = ?, hora_Salida = ?, clave_Dia = ?, clave_SubGrupo = ?, clave_Sala = ? WHERE clave_Horario = ?',
                    [hora_Entrada, hora_Salida, clave_Dia, clave_SubGrupo, clave_Sala,clave_SubGrupo,clave_Horario], (err, result) => {
                        if (err) {
                            console.error(err);
                            return db.rollback(() => {
                                res.status(500).send("Error interno del servidor");
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Error al confirmar la transacción:", err);
                                    res.status(500).send("Error interno del servidor");
                                });
                            }

                            res.status(200).send("Horario y SubGrupo Modificado con éxito");
                        });
                    });
            });
    });
});

module.exports = router;