import Axios from 'axios';

const SalaMaterialService = {
    registrarSalaMaterial:(datos) => {
        return Axios.post("http://localhost:3001/salamaterial/registrarSalaMaterial",datos);
    },registrarSalaMaterialdos:(datos) => {
        return Axios.post("http://localhost:3001/salamaterial/registrarSalaMaterialdos",datos);
    },eliminarSalaMaterial:(datos) => {
        return Axios.delete("http://localhost:3001/salamaterial/eliminarSalaMaterial",{
            data: datos
        });
    }
    
}

export default SalaMaterialService;