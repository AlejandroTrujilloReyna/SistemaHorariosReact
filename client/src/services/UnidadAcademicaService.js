import Axios from 'axios';

const UnidadAcademicaService = {
    registrarUnidadAcademica: (datos) => {
        return Axios.post("http://localhost:3001/unidadacademica/registrarUnidadAcademica", datos);
    },
    unidadesAcademicas:()=>{
        return Axios.get("http://localhost:3001/unidadacademica/unidadesAcademicas");
    }
}

export default UnidadAcademicaService;