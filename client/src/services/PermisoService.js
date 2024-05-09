import Axios from "axios";


const PermisoService = {
    consultarPermiso:()=>{
        return Axios.get("http://localhost:3001/permiso/consultarPermiso");
    }
}

export default PermisoService;