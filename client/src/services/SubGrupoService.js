import Axios from 'axios';
//Se llamara el SubGrupoService con los diferentes metodos que posee desde Servidor hacia Componentes(dependiendo de la entidad que lo ocupe) 
const SubGrupoService = {
    registrarSubGrupo: (datos) => {
        return Axios.post("http://localhost:3001/subgrupo/registrarSubGrupo", datos);
    },
    consultarSubGrupo:() => {
        return Axios.get("http://localhost:3001/subgrupo/consultarSubGrupo");
    }, modificarSubGrupo: (datos)=>{
        return Axios.put("http://localhost:3001/subgrupo/modificarSubGrupo", datos);
    } , consultarGrupo:() => {
        return Axios.get("http://localhost:3001/subgrupo/consultarGrupo");
    }         
}

export default SubGrupoService;