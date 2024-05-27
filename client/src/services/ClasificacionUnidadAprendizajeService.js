import Axios from 'axios';

const ClasificacionUnidadAprendizajeService = {
    consultarClasificacionUnidadAprendizaje:() => {
        return Axios.get("http://localhost:3001/clasificacionunidadaprendizaje/consultarClasificacionUnidadAprendizaje");
    }  
}

export default ClasificacionUnidadAprendizajeService;