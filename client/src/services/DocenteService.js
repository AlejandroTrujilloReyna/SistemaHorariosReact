import Axios from 'axios';

const DocenteService = {
    registrarDocente: (datos) => {
        return Axios.post("http://localhost:3001/docente/registrarDocente", datos);
    },
    consultarDocente: () => {
        return Axios.get("http://localhost:3001/docente/consultarDocente");
    },
    modificarDocente: (datos) => {
        return Axios.put("http://localhost:3001/docente/modificarDocente",datos);
    }
}

export default DocenteService;