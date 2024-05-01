import Axios from 'axios';

const PlaEstudiosService = {
    registrarPlaEstudios: (datos) =>{
        return Axios.post("http://localhost:3001/plaestudios/registrarPlaEstudios",datos);
    },//MOVER CUANDO SE CREE LA PARTE DE PLAN DE ESTUDIOS
    consultarPlaestudios:()=>{
        return Axios.get("http://localhost:3001/plaestudios/consultarPlaEstudios");
    },
    modificarPlaEstudios:(datos)=>{
        return Axios.put("http://localhost:3001/plaestudios/modificarPlaEstudios", datos)

    }  
}

export default PlaEstudiosService;