import Axios from 'axios';

const TipoSalaService = {
    registrarTipoSala: (datos) =>{
        return Axios.post("http://localhost:3001/tiposala/registrarTipoSala",datos);
    },
    consultarTipoSala: () =>{
        return Axios.get("http://localhost:3001/tiposala/consultarTipoSala");
    },
    modificarTipoSala: (datos) =>{
        return Axios.put("http://localhost:3001/tiposala/modificarTipoSala",datos);
    }
}

export default TipoSalaService;