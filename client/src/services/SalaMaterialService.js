import Axios from 'axios';

const SalaMaterialService = {
    registrarSalaMaterial: (datos) =>{
        return Axios.post("http://localhost:3001/salamaterial/registrarSalaMaterial",datos);
    },//MOVER CUANDO SE CREE LA PARTE DE TIPO SALA
    consultarSalaMaterial:()=>{
        return Axios.get("http://localhost:3001/salamaterial/consultarSalaMaterial");
    },
    consultarSala:()=>{
        return Axios.get("http://localhost:3001/salamaterial/consultarSala");
    },    
    consultarMaterial:()=>{
        return Axios.get("http://localhost:3001/salamaterial/consultarMaterial");
    },    
    modificarSalaMaterial: (datos)=>{
        return Axios.put("http://localhost:3001/salamaterial/modificarSalaMaterial", datos);
    },
    eliminarSalaMaterial:(datos)=>{
        return Axios.delete("http://localhost:3001/salamaterial/eliminarSalaMaterial", {
            data: datos
        });
    }   
}

export default SalaMaterialService;