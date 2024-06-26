import Axios from "axios";


const UnidadAprendizajeService = {
    registrarUnidadAprendizaje: (datos) => {
        return Axios.post("http://localhost:3001/unidadaprendizaje/registrarUnidadAprendizaje", datos);
    },//MOVER CUANDO SE CREE LA PARTE DE PLAN DE ESTUDIOS
    consultarPlandeestudios:()=>{
        return Axios.get("http://localhost:3001/unidadaprendizaje/consultarPlandeestudios");
    },
    consultarUnidadAprendizaje:()=>{
        return Axios.get("http://localhost:3001/unidadaprendizaje/consultarUnidadAprendizaje");
    },
    consultarUnidadAprendizajePlanEstudiosdos:(datos)=>{
        return Axios.get("http://localhost:3001/unidadaprendizaje/consultarUnidadAprendizajePlanEstudiosdos", {params: datos});
    },
    modificarUnidadAprendizaje:(datos)=>{
        return Axios.put("http://localhost:3001/unidadaprendizaje/modificarUnidadAprendizaje", datos)

    }

}

export default UnidadAprendizajeService;