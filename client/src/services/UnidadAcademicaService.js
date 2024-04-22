import Axios from 'axios';

const UnidadAcademicaService = {
    registrarUnidadAcademica: (datos) => {
        return Axios.post("http://localhost:3001/unidadacademica/registrarUnidadAcademica", datos);
    },
    consultarUnidadAcademica:()=>{
        return Axios.get("http://localhost:3001/unidadacademica/consultarUnidadAcademica");
    }
}

export default UnidadAcademicaService;