import Axios from 'axios';

const DiaService = {
    consultarDia:() => {
        return Axios.get("http://localhost:3001/dia/consultarDia");
    }  
}

export default DiaService;