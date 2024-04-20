import Axios from 'axios';

const UnidadAcademicaService = {
    registrarUnidadAcademica: (datos) => {
        return Axios.post("http://localhost:3001/registrarUnidadAcademica", datos);
    }
}

export default UnidadAcademicaService;