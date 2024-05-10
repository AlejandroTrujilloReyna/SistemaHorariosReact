import Axios from "axios";


const GradoEstudioService = {
    registrarGradoEstudio: (datos) => {
        return Axios.post("http://localhost:3001/gradoestudio/registrarGradoEstudio", datos);
    },//MOVER CUANDO SE CREE LA PARTE DE PLAN DE ESTUDIOS
    consultarGradoEstudio:()=>{
        return Axios.get("http://localhost:3001/gradoestudio/consultarGradoEstudio");
    },
    modificarGradoEstudio:(datos)=>{
        return Axios.put("http://localhost:3001/gradoestudio/modificarGradoEstudio", datos)

    }

}

export default GradoEstudioService;