import Axios from 'axios';

const ModificarSubgruposService = {
    registrarModificarSubgrupos: (datos) => {
        return Axios.post("http://localhost:3001/modificarsubgrupos/registrarModificarSubgrupos", datos);
    },
    consultarModificarSubgrupos:() =>{
        return Axios.get("http://localhost:3001/modificarsubgrupos/consultarModificarSubgrupos");
    },modificarModificarSubgrupos: (datos)=>{
        return Axios.put("http://localhost:3001/modificarsubgrupos/modificarModificarSubgrupos", datos);
    }, 
    obtenerUAPE: () =>{//QUITAR CUANDO UNAS TODO
        return Axios.get("http://localhost:3001/modificarsubgrupos/obtenerUAPE");
    }
}

export default ModificarSubgruposService;