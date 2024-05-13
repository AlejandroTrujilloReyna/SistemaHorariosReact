import Axios from "axios";


const HorarioActividadService = {
    registrarHorarioActividad: (datos) => {
        return Axios.post("http://localhost:3001/horarioactividad/registrarHorarioActividad", datos);
    },
    consultarHorarioActividad:()=>{
        return Axios.get("http://localhost:3001/horarioactividad/consultarHorarioActividad");
    },
    modificarHorarioActividad:(datos)=>{
        return Axios.put("http://localhost:3001/horarioactividad/modificarHorarioActividad", datos)

    }
}

export default HorarioActividadService;