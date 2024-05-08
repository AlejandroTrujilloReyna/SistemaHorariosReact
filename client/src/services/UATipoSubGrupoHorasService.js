import Axios from 'axios';

const UATipoSubGrupoHorasService = {
    registrarUATipoSubGrupoHoras: (datos) => {
        return Axios.post("http://localhost:3001/uatiposubgrupohoras/registrarUATipoSubGrupoHoras", datos);
    },
    consultarUATipoSubGrupoHoras:() => {
        return Axios.get("http://localhost:3001/uatiposubgrupohoras/consultarUATipoSubGrupoHoras");
    },
    modificarUATipoSubGrupoHoras: (datos)=>{
        return Axios.put("http://localhost:3001/uatiposubgrupohoras/modificarUATipoSubGrupoHoras", datos);
    }        
}

export default UATipoSubGrupoHorasService;