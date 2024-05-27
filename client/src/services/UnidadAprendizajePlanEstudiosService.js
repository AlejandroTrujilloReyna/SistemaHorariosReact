import Axios from 'axios';

const UnidadAprendizajePlanEstudiosService = {
    registrarUnidadAprendizajePlanEstudios: (datos) =>{
        return Axios.post("http://localhost:3001/unidadaprendizajeplanestudios/registrarUnidadAprendizajePlanEstudios",datos);
    },
    consultarUnidadAprendizajePlanEstudios: () =>{
        return Axios.get("http://localhost:3001/unidadaprendizajeplanestudios/consultarUnidadAprendizajePlanEstudios");
    },
    modificarUnidadAprendizajePlanEstudios: (datos) =>{
        return Axios.put("http://localhost:3001/unidadaprendizajeplanestudios/modificarUnidadAprendizajePlanEstudios",datos);
    }
}

export default UnidadAprendizajePlanEstudiosService;