import Axios from 'axios';

const ProgramaEducativoDocenteService = {
    registrarProgramaEducativoDocentedos:(datos) => {
        return Axios.post("http://localhost:3001/programaeducativodocente/registrarProgramaEducativoDocentedos",datos);
    },eliminarProgramaEducativoDocente:(datos) => {
        return Axios.delete("http://localhost:3001/programaeducativodocente/eliminarProgramaEducativoDocente",{
            data: datos
        });
    },consultarProgramaEducativoDocente:(datos) => {
        return Axios.get("http://localhost:3001/programaeducativodocente/consultarProgramaEducativoDocente",datos);
    },consultarProgEducativoDocente:() => {
        return Axios.get("http://localhost:3001/programaeducativodocente/consultarProgEducativoDocente");
    }
    
}

export default ProgramaEducativoDocenteService;