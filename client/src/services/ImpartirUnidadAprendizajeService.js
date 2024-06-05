import Axios from 'axios';

const ImpartirUnidadAprendizajeService = {
    registrarImpartirUnidadAprendizaje:(datos) => {
        return Axios.post("http://localhost:3001/impartirunidadaprendizaje/registrarImpartirUnidadAprendizaje",datos);
    },registrarImpartirUnidadAprendizajedos:(datos) => {
        return Axios.post("http://localhost:3001/impartirunidadaprendizaje/registrarImpartirUnidadAprendizajedos",datos);
    },eliminarImpartirUnidadAprendizaje:(datos) => {
        return Axios.delete("http://localhost:3001/impartirunidadaprendizaje/eliminarImpartirUnidadAprendizaje",{
            data: datos
        });
    }
    
}

export default ImpartirUnidadAprendizajeService;