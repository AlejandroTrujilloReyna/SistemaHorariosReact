import Axios from 'axios';

const TipoSubGrupoService = {
    registrarTipoSubGrupo: (datos) => {
        return Axios.post("http://localhost:3001/tiposubgrupo/registrarTipoSubGrupo", datos);
    },
    consultarTipoSubGrupo:() => {
        return Axios.get("http://localhost:3001/tiposubgrupo/consultarTipoSubGrupo");
    },modificarTipoSubGrupo: (datos)=>{
        return Axios.put("http://localhost:3001/tiposubgrupo/modificarTipoSubGrupo", datos);
    }        
}

export default TipoSubGrupoService;