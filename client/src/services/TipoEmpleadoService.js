import Axios from "axios";


const TipoEmpleadoService = {
    registrarTipoEmpleado: (datos) => {
        return Axios.post("http://localhost:3001/tipoempleado/registrarTipoEmpleado", datos);
    },//MOVER CUANDO SE CREE LA PARTE DE PLAN DE ESTUDIOS
    consultarTipoEmpleado:()=>{
        return Axios.get("http://localhost:3001/tipoempleado/consultarTipoEmpleado");
    },
    modificarTipoEmpleado:(datos)=>{
        return Axios.put("http://localhost:3001/tipoempleado/modificarTipoEmpleado", datos)

    }

}

export default TipoEmpleadoService;