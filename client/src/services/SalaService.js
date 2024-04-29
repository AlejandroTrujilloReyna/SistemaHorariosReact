import Axios from 'axios';

const SalaService = {
    registrarSala: (datos) =>{
        return Axios.post("http://localhost:3001/sala/registrarSala",datos);
    },//MOVER CUANDO SE CREE LA PARTE DE TIPO SALA
    consultarTiposala:()=>{
        return Axios.get("http://localhost:3001/sala/consultarTiposala");
    },
    consultarSala:()=>{
        return Axios.get("http://localhost:3001/sala/consultarSala");
    },    
    modificarSala: (datos)=>{
        return Axios.put("http://localhost:3001/sala/modificarSala", datos);
    }   
}

export default SalaService;