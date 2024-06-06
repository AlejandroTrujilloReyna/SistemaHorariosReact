import Axios from 'axios';

const UnidadAcademicaService = {
    registrarUnidadAcademica: (datos) => {
        return Axios.post("http://localhost:3001/unidadacademica/registrarUnidadAcademica", datos);
    },
    consultarUnidadAcademica:()=>{
        return Axios.get("http://localhost:3001/unidadacademica/consultarUnidadAcademica");
    },
    modificarUnidadAcademica: (datos)=>{
        return Axios.put("http://localhost:3001/unidadacademica/modificarUnidadAcademica", datos);
    },
    eliminarUnidadAcademica:(datos)=>{
        return Axios.delete(`http://localhost:3001/unidadacademica/eliminarUnidadAcademica/${datos}`);
    }    
}

export default UnidadAcademicaService;