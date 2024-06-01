import Axios from "axios";


const GrupoService = {
    registrarGrupo: (datos) => {
        return Axios.post("http://localhost:3001/grupo/registrarGrupo", datos);
    },
    consultarGrupo:()=>{
        return Axios.get("http://localhost:3001/Grupo/consultarGrupo");
    },
    modificarGrupo:(datos)=>{
        return Axios.put("http://localhost:3001/Grupo/modificarGrupo", datos)

    }
}

export default GrupoService;