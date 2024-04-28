import Axios from 'axios';

const EdificioService = {
    registrarEdificio: (datos) => {
        return Axios.post("http://localhost:3001/edificio/registrarEdificio", datos);
    },
    consultarEdificio: () => {
        return Axios.get("http://localhost:3001/edificio/consultarEdificio");
    },
    modificarEdificio: (datos) => {
        return Axios.put("http://localhost:3001/edificio/modificarEdificio",datos);
    }
}

export default EdificioService;