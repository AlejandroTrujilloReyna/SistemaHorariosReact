import Axios from 'axios';

const PlanEstudiosService = {
    registrarPlanEstudios: (datos) =>{
        return Axios.post("http://localhost:3001/planestudios/registrarPlanEstudios",datos);
    },//MOVER CUANDO SE CREE LA PARTE DE PLAN DE ESTUDIOS
    consultarPlanestudios:()=>{
        return Axios.get("http://localhost:3001/planestudios/consultarPlanEstudios");
    },
    modificarPlanEstudios:(datos)=>{
        return Axios.put("http://localhost:3001/planestudios/modificarPlanEstudios", datos)

    }  
}

export default PlanEstudiosService;