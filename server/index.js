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

const actividadRoutes = require("./routes/actividad")
app.use("/actividad", actividadRoutes);

const horarioactividadRoutes = require("./routes/horarioactividad")
app.use("/horarioactividad", horarioactividadRoutes);

const diaRoutes = require("./routes/dia")
app.use("/dia", diaRoutes);

const usaredificioRoutes = require("./routes/UsarEdificio")
app.use("/usaredificio", usaredificioRoutes);

const unidadaprendizajeplanestudiosRoutes = require("./routes/unidadaprendizajeplanestudios")
app.use("/unidadaprendizajeplanestudios",unidadaprendizajeplanestudiosRoutes)

const etapaRoutes = require("./routes/etapa")
app.use("/etapa",etapaRoutes)

const clasificacionunidadaprendizajeRoutes = require("./routes/clasificacionunidadaprendizaje")
app.use("/clasificacionunidadaprendizaje",clasificacionunidadaprendizajeRoutes)

const modificarsubgruposRoutes = require("./routes/modificarsubgrupos")
app.use("/modificarsubgrupos",modificarsubgruposRoutes);

const horarioRoutes = require("./routes/horario")
app.use("/horario",horarioRoutes);

const subgrupoRoutes = require("./routes/subgrupo")
app.use("/subgrupo",subgrupoRoutes)

const materialRoutes = require("./routes/material")
app.use("/material", materialRoutes);

const salamaterialRoutes = require("./routes/salamaterial")
app.use("/salamaterial", salamaterialRoutes);

const grupoRoutes = require("./routes/grupo")
app.use("/grupo", grupoRoutes);

const impartirunidadaprendizajeRoutes = require("./routes/impartirunidadaprendizaje")
app.use("/impartirunidadaprendizaje", impartirunidadaprendizajeRoutes);

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});