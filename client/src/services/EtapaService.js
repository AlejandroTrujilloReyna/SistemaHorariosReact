import Axios from 'axios';

const EtapaService = {
    consultarEtapa:() => {
        return Axios.get("http://localhost:3001/etapa/consultarEtapa");
    }  
}

export default EtapaService;