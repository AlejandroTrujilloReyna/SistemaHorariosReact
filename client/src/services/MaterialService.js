import Axios from 'axios';

const MaterialService = {
    registrarMaterial: (datos) => {
        return Axios.post("http://localhost:3001/material/registrarMaterial", datos);
    },
    consultarMaterial: () => {
        return Axios.get("http://localhost:3001/material/consultarMaterial");
    },
    modificarMaterial: (datos) => {
        return Axios.put("http://localhost:3001/material/modificarMaterial",datos);
    }
}

export default MaterialService;