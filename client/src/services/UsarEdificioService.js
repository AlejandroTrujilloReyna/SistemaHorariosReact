import Axios from "axios";


const UsarEdificioService = {
    registrarUsarEdificio: (datos) => {
        return Axios.post("http://localhost:3001/UsarEdificio/registrarUsarEdificio", datos);
    },
    consultarUsarEdificio:()=>{
        return Axios.get("http://localhost:3001/UsarEdificio/consultarUsarEdificio");
    },
    modificarUsarEdificio:(datos)=>{
        return Axios.put("http://localhost:3001/UsarEdificio/modificarUsarEdificio",datos);
    }

}

export default UsarEdificioService;