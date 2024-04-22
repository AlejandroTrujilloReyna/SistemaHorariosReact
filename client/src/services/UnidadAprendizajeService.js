import Axios from "axios";


const UnidadAprendizajeService = {
    registrarUnidadAprendizaje: (datos) => {
        return Axios.post("http://localhost:3001/unidadaprendizaje/registrarUnidadAprendizaje", datos);
    },
    consultarPlandeestudios:()=>{
        return Axios.get("http://localhost:3001/unidadaprendizaje/consultarPlandeestudios");
    }
    
    /*,
    unidadesAprendizajes:()=>{
        return Axios.get("http://localhost:3001/unidadaprendizaje/unidadesAprendizajes");
    }*/
}

export default UnidadAprendizajeService;