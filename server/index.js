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


app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});