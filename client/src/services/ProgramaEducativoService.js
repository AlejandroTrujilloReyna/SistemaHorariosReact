import Axios from 'axios';

const ProgramaEducativoService = {
    registrarProgramaEducativo: (datos) => {
        return Axios.post("http://localhost:3001/programaeducativo/registrarProgramaEducativo", datos);
    }
}

export default ProgramaEducativoService;