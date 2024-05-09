import Axios from "axios";


const UsuarioService = {
    registrarUsuario: (datos) => {
        return Axios.post("http://localhost:3001/usuario/registrarUsuario", datos);
    },
    consultarUsuario:()=>{
        return Axios.get("http://localhost:3001/usuario/consultarUsuario");
    },
    modificarUsuario:(datos)=>{
        return Axios.put("http://localhost:3001/usuario/modificarUsuario", datos)

    }

}

export default UsuarioService;