import Axios from 'axios';

const HorarioService = {
    registrarHorario: (datos) => {
        return Axios.post("http://localhost:3001/horario/registrarHorario", datos);
    },
    consultarHorario:() => {
        return Axios.get("http://localhost:3001/horario/consultarHorario");
    },
    modificarHorario:(datos)=>{
        return Axios.put("http://localhost:3001/horario/modificarHorario", datos)
    },    
    CONSULTARSG:()=>{
        return Axios.get("http://localhost:3001/horario/CONSULTARSG");
    }
}

export default HorarioService;