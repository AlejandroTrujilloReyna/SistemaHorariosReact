const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const unidadacademicaRoutes = require("./routes/unidadacademica");
app.use("/unidadacademica", unidadacademicaRoutes);

const programaeducativoRoutes = require("./routes/programaeducativo");
app.use("/programaeducativo", programaeducativoRoutes);

const unidadaprendizajeRoutes = require("./routes/unidadaprendizaje")
app.use("/unidadaprendizaje", unidadaprendizajeRoutes);

const edificioRoutes = require("./routes/edificio");
app.use("/edificio", edificioRoutes);

const salaRoutes = require("./routes/sala");
app.use("/sala", salaRoutes);

const tiposalaRoutes = require("./routes/tiposala");
app.use("/tiposala", tiposalaRoutes);

const planestudiosRoutes = require("./routes/planestudios");
app.use("/planestudios", planestudiosRoutes);

const tiposubgrupoRoutes = require("./routes/tiposubgrupo");
app.use("/tiposubgrupo", tiposubgrupoRoutes);

const uatiposubgrupohorasRoutes = require("./routes/uatiposubgrupohoras");
app.use("/uatiposubgrupohoras", uatiposubgrupohorasRoutes);

const usuarioRoutes = require("./routes/usuario");
app.use("/usuario", usuarioRoutes);

const permisoRoutes = require("./routes/permiso");
app.use("/permiso", permisoRoutes);

const tipoempleadoRoutes = require("./routes/tipoempleado")
app.use("/tipoempleado", tipoempleadoRoutes);

const gradoestudioRoutes = require("./routes/gradoestudio")
app.use("/gradoestudio", gradoestudioRoutes);

const docenteRoutes = require("./routes/docente")
app.use("/docente", docenteRoutes);

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});