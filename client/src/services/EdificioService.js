import Axios from 'axios';

const EdificioService = {
    registrarEdificio: (datos) => {
        return Axios.post("http://localhost:3001/edificio/registrarEdificio", datos);
    }
}

export default EdificioService;