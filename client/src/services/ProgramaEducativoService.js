import Axios from 'axios';

const ProgramaEducativoService = {
    registrarProgramaEducativo: (datos) => {
        return Axios.post("http://localhost:3001/programaeducativo/registrarProgramaEducativo", datos);
    },
    consultarProgramaEducativo:() => {
        return Axios.get("http://localhost:3001/programaeducativo/consultarProgramaEducativo");
    },modificarProgramaEducativo: (datos)=>{
        return Axios.put("http://localhost:3001/programaeducativo/modificarProgramaEducativo", datos);
    }        
}

export default ProgramaEducativoService;