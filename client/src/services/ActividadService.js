import Axios from "axios";

const ActividadService = {
    registrarActividad: (datos) => {
        return Axios.post("http://localhost:3001/actividad/registrarActividad", datos);
    },
    consultarActividad:()=>{
        return Axios.get("http://localhost:3001/actividad/consultarActividad");
    },
    modificarActividad: (datos)=>{
        return Axios.put("http://localhost:3001/actividad/modificarActividad", datos);
    }
}

export default ActividadService;