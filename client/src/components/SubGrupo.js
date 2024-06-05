import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import SubGrupoService from '../services/SubGrupoService';
import DocenteService from '../services/DocenteService';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';
import TipoSubGrupoService from '../services/TipoSubGrupoService';
import ToastService from '../services/ToastService';
import UsuarioService from '../services/UsuarioService';
import { mostrarExito, mostrarAdvertencia, mostrarError } from '../services/ToastService';
const SubGrupo = () => {
//VARIABLES PARA EL REGISTRO
const [clave_SubGrupo, setclave_SubGrupo] = useState("");
const [no_SubGrupo,setno_SubGrupo] = useState("");
const [capacidad_SubGrupo,setcapacidad_SubGrupo] = useState("");
const [horas_Asignadas,sethoras_Asignadas] = useState("");
const [clave_Grupo,setclave_Grupo] = useState(null);
const [no_Empleado_Docente, setno_Empleado_Docente] = useState(null);
const [clave_UnidadAprendizaje, setclave_UnidadAprendizaje] = useState(null);
const [clave_TipoSubGrupo, setclave_TipoSubGrupo] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [subgrupoList,setsubgrupoList] = useState([]);
  const [filtroSubGrupo, setfiltroSubGrupo] = useState([]);
  const [grupos, setgrupos] = useState([]);
  const [docentes, setdocentes] = useState([]);
  const [UnidadesAprendizaje, setUnidadesAprendizaje] = useState([]);
  const [tipossubgrupos, settipossubgrupos] = useState([]);
  const [usuarios, setusuarios] = useState([]);
  const [DocentesConNombre, setDocentesConNombre] = useState([]);
  
//VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
const [editando,seteditando] = useState(false);
//VARIABLES PARA EL ERROR
const toast = useRef(null);


  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setno_SubGrupo("");
    setcapacidad_SubGrupo("");    
    sethoras_Asignadas("");
    setclave_Grupo(null);
    setno_Empleado_Docente(null);
    setclave_UnidadAprendizaje(null);
    setclave_TipoSubGrupo(null);
  } 

    //COLUMNAS PARA LA TABLA
    const columns = [
        {field: 'clave_SubGrupo', header: 'Clave del SubGrupo' },
        {field: 'no_SubGrupo', header: 'No.SubGrupo' },
        {field: 'capacidad_SubGrupo', header: 'Capacidad' },
        {field: 'horas_Asignadas', header: 'Horas Asignadas' },
        {field: 'clave_Grupo', header: 'Grupo' },
        {field: 'no_Empleado_Docente', header: 'Docente' },
        {field: 'clave_UnidadAprendizaje', header: 'Unidad de Aprendizaje' },
        {field: 'clave_TipoSubGrupo', header: 'Tipo de SubGrupo' }
      ];
   //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
 useEffect(() => {
    get();
  },[]);
  
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = subgrupoList.filter((item) => {  
    const nombregrup = grupos.find(gru => gru.clave_SubGrupo === item.clave_SubGrupo)?.nombre_TSubGrupo || '';
    const nombredocente = docentes.find(doce => doce.no_Empleado_Docente === item.no_Empleado_Docente)?.no_EmpleadoDocente || '';
    const nombreunidad = UnidadesAprendizaje.find(unid => unid.clave_UnidadAprendizaje === item.clave_UnidadAprendizaje)?.nombre_UnidadAprendizaje || '';
    const nombretiposubgrupo = tipossubgrupos.find(tisu => tisu.clave_TipoSubGrupo === item.clave_TipoSubGrupo)?.nombre_TipoSubGrupo || '';
   
        return (
            item.clave_SubGrupo.toString().includes(value) ||
            item.no_SubGrupo.toString().includes(value) || 
            item.capacidad_SubGrupo.toString().includes(value) ||
            item.horas_Asignadas.toString().includes(value) ||
            nombregrup.toString().includes(value) ||
            nombredocente.toString().includes(value) ||
            nombreunidad.toLowerCase().includes(value) ||
            nombretiposubgrupo.toLowerCase().includes(value) 
        );
    });
    setfiltroSubGrupo(filteredData);
  };  

 //FUNCION PARA REGISTRAR
 const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!no_SubGrupo || !capacidad_SubGrupo || !horas_Asignadas || !clave_Grupo || !no_Empleado_Docente || !clave_UnidadAprendizaje || !clave_TipoSubGrupo) {      
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    SubGrupoService.registrarSubGrupo({
    no_SubGrupo : no_SubGrupo,
    capacidad_SubGrupo : capacidad_SubGrupo,
     horas_Asignadas : horas_Asignadas,
    clave_Grupo : clave_Grupo,
     no_Empleado_Docente : no_Empleado_Docente,
     clave_UnidadAprendizaje : clave_UnidadAprendizaje,
     clave_TipoSubGrupo : clave_TipoSubGrupo
         
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito(toast,"Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
     if(error.response.status === 500){  
        mostrarError(toast,"Error interno del servidor");
      }     
    });
  } 
  //FUNCION PARA CONSULTA
  const get = ()=>{
    SubGrupoService.consultarSubGrupo().then((response)=>{//CASO EXITOSO
      setsubgrupoList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }
//FUNCION PARA LA MODIFICACION
const put = (rowData) =>{
  SubGrupoService.modificarSubGrupo(rowData).then((response)=>{//CASO EXITOSO
    if (response.status === 200) {
      mostrarExito(toast,"Modificación Exitosa");        
    }
  }).catch(error=>{//EXCEPCIONES
   if (error.response.status === 500) {
      mostrarError(toast,"Error del sistema");
    }
  });
}


  const validarNumero = (value) => {
    // Expresión regular para validar números enteros positivos
    const regex = /^[0-9]\d*$/;
    // Verificar si el valor coincide con la expresión regular
    return value==='' || regex.test(value);
  };  




  //MANDAR A LLAMAR A LA LISTA DE USUARIOS
  useEffect(() => {
    UsuarioService.consultarUsuario()
      .then(response => {
        setusuarios(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos empleado:", error);
      });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE GRUPOS
 useEffect(() => {
    SubGrupoService.consultarGrupo()
      .then(response => {
        setgrupos(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos empleado:", error);
      });
  }, []);


 //MANDAR A LLAMAR A LA LISTA DE DOCENTE
 useEffect(() => {
    DocenteService.consultarDocente()
      .then(response => {
        setdocentes(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos empleado:", error);
      });
  }, []);
  
 

   //MANDAR A LLAMAR A LA LISTA DE UNIDADES DE APRENDIZAJE
 useEffect(() => {
    UnidadAprendizajeService.consultarUnidadAprendizaje()
      .then(response => {
        setUnidadesAprendizaje(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos empleado:", error);
      });
  }, []);

 //MANDAR A LLAMAR A LA LISTA DE TIPOS DE SUBGRUPOS
 useEffect(() => {
    TipoSubGrupoService.consultarTipoSubGrupo()
      .then(response => {
        settipossubgrupos(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos empleado:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE LA INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
const renderBody = (rowData, field) => {
    if (field === 'clave_Grupo') {
      const gru = grupos.find((gru) => gru.clave_Grupo === rowData.clave_Grupo);
      return gru ? `${gru.nombre_Grupo} ` : '';
    } else if (field === 'no_Empleado_Docente') {
      const doce = docentes.find((doce) => doce.no_EmpleadoDocente === rowData.no_Empleado_Docente);
      return doce ? `${doce.no_EmpleadoDocente} ` : '';
    } else if (field === 'clave_UnidadAprendizaje') {
        const unidad = UnidadesAprendizaje.find((unidad) => unidad.clave_UnidadAprendizaje === rowData.clave_UnidadAprendizaje);
        return unidad ? `${unidad.nombre_UnidadAprendizaje} ` : '';
    } else if (field === 'clave_TipoSubGrupo') {
        const tisu = tipossubgrupos.find((tisu) => tisu.clave_TipoSubGrupo === rowData.clave_TipoSubGrupo);
        return tisu ? `${tisu.nombre_TipoSubGrupo} ` : '';
    } else {
      return rowData[field];
    }
  };
//EDITAR NUMEROS
const numberEditor = (options) => {
  return <InputText keyfilter="int"  type="text" maxLength={4} value={options.value} 
  onChange={(e) => {
    if (validarNumero(e.target.value)) { 
      options.editorCallback(e.target.value)
    }
  }} onKeyDown={(e) => e.stopPropagation()} />;
};

//EDITAR GRUPOS
const GruposEditor = (options) => {
  return (
      <Dropdown
          value={options.value}
          options={grupos}
          onChange={(e) => options.editorCallback(e.value)}            
          optionLabel = {(option) => `${option.nombre_Grupo}`}
          optionValue="clave_Grupo" // Aquí especificamos que la clave del grupo se utilice como el valor de la opción seleccionada
          placeholder="Seleccione un Grupo"             
      />
  );
};
//EDITAR DOCENTE
const DocenteEditor = (options) => {
  return (
      <Dropdown
          value={options.value}
          options={docentes}
          onChange={(e) => options.editorCallback(e.value)}            
          optionLabel ="no_EmpleadoDocente"
          optionValue="no_EmpleadoDocente" // Aquí especificamos que la clave del Docente se utilice como el valor de la opción seleccionada
          placeholder="Seleccione un Docente"             
      />
  );
};
//EDITAR UNIDAD APRENDIZAJE
const UnidadAprendizajeEditor = (options) => {
  return (
      <Dropdown
          value={options.value}
          options={UnidadesAprendizaje}
          onChange={(e) => options.editorCallback(e.value)}            
          optionLabel = {(option) => `${option.clave_UnidadAprendizaje}- ${option.nombre_UnidadAprendizaje}`}
          optionValue="clave_UnidadAprendizaje" // Aquí especificamos que la clave del la Unidad de Aprendizaje se utilice como el valor de la opción seleccionada
          placeholder="Seleccione un Unidad de Aprendizaje"             
      />
  );
};
//EDITAR TIPO DE SUBGRUPO
const TipoSubGrupoEditor = (options) => {
  return (
      <Dropdown
          value={options.value}
          options={tipossubgrupos}
          onChange={(e) => options.editorCallback(e.value)}            
          optionLabel = "nombre_TipoSubGrupo"
          optionValue="clave_TipoSubGrupo" // Aquí especificamos que la clave del Tipo de SubGrupo se utilice como el valor de la opción seleccionada
          placeholder="Seleccione un Tipo de SubGrupo"             
      />
  );
};
 //ACTIVAR EDICION DE CELDA
 const cellEditor = (options) => {
  switch(options.field){  
    case 'no_SubGrupo':
      return numberEditor(options);
      case 'capacidad_SubGrupo':
      return numberEditor(options);
      case 'horas_Asignadas':
      return numberEditor(options);
    case 'clave_Grupo':
      return GruposEditor(options);
    case 'no_Empleado_Docente':
      return DocenteEditor(options);
    case 'clave_UnidadAprendizaje':
      return UnidadAprendizajeEditor(options);
      case 'clave_TipoSubGrupo':
      return TipoSubGrupoEditor(options);
      default:
      return numberEditor(options);
  }    
};

//COMPLETAR MODIFICACION
const onCellEditComplete = (e) => {
  let { rowData, newValue, field, originalEvent: event } = e;
  switch (field) {
    //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
    case 'no_SubGrupo':
      if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
        rowData[field] = newValue; put(rowData);
      }
      else{
        event.preventDefault();
      } 
      break;
    case 'capacidad_SubGrupo':
      if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
        rowData[field] = newValue; put(rowData);
      }else{
        event.preventDefault();
      }
      break;
    case 'horas_Asignadas':
      if(newValue >= 0 && newValue !== null && newValue !== rowData[field]){
        rowData[field] = newValue; put(rowData);
      }else{
        event.preventDefault();
      }
      break;
    case 'clave_Grupo':
      if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
        rowData[field] = newValue; put(rowData);
      }else{
        event.preventDefault();
      }
      break; 
      case 'no_Empleado_Docente':
      if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
        rowData[field] = newValue; put(rowData);
      }else{
        event.preventDefault();
      }
      break; 
      case 'clave_UnidadAprendizaje':
      if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
        rowData[field] = newValue; put(rowData);
      }else{
        event.preventDefault();
      }
      break; 
      case 'clave_TipoSubGrupo':
      if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
        rowData[field] = newValue; put(rowData);
      }else{
        event.preventDefault();
      }
      break;  
    default:
    break;
  }
  seteditando(false);
};




return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar SubGrupo" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-5">
            <label>Grupo*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_Grupo} 
              options={grupos} 
              onChange={(e) => {
                setclave_Grupo(e.value);
              }} 
              
              optionLabel = "nombre_Grupo"
              optionValue="clave_Grupo" // Aquí especificamos que la clave del grupo se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Grupo"               
            />
          </div>
          <div className="field col-3">
            <label>Docente Asignado*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={no_Empleado_Docente} 
              options={docentes} 
              onChange={(e) => {
                setno_Empleado_Docente(e.value);
              }} 
              
              optionLabel = "no_EmpleadoDocente"
              optionValue="no_EmpleadoDocente" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione El docente a impartir"               
            />
          </div>
          <div className="field col-3">
            <label>Unidad de Aprendizaje Impartida*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_UnidadAprendizaje} 
              options={UnidadesAprendizaje} 
              onChange={(e) => {
                setclave_UnidadAprendizaje(e.value);
              }} 
              
              optionLabel = {(option) => `${option.clave_UnidadAprendizaje} - ${option.nombre_UnidadAprendizaje}`}
              optionValue="clave_UnidadAprendizaje" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione la Unidad de Aprendizaje"               
            />
          </div>
          <div className="field col-3">
            <label>Tipo de SubGrupo*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_TipoSubGrupo} 
              options={tipossubgrupos} 
              onChange={(e) => {
                setclave_TipoSubGrupo(e.value);
              }} 
             
              optionLabel = "nombre_TipoSubGrupo"
              optionValue="clave_TipoSubGrupo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Tipo de SubGrupo"               
            />
          </div>
          <div className="field col-2">
              <label>Numero de SubGrupo*</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={no_SubGrupo} maxLength={4}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setno_SubGrupo(event.target.value);
                    }
                  }} 
                  placeholder="Ej.143" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Capacidad del Subgrupo*</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={capacidad_SubGrupo} maxLength={4}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setcapacidad_SubGrupo(event.target.value);
                    }
                  }} 
                  placeholder="Ej.30" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>   
          <div className="field col-2">
              <label>Horas Asignadas*</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={horas_Asignadas} maxLength={4}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_Asignadas(event.target.value);
                    }
                  }} 
                  placeholder="Ej.3" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>   
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>  
       {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}

<Panel header="Consultar Subgrupos" className='mt-3' toggleable>
 <div className="mx-8 mb-4">
   <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
 </div>
 <DataTable value={filtroSubGrupo.length ? filtroSubGrupo :subgrupoList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
 {columns.map(({ field, header }) => {
    return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '5%' }} editor={field === 'clave_SubGrupo' ? null : (options) => cellEditor(options)}
    onCellEditComplete={onCellEditComplete}
    body={(rowData) => renderBody(rowData, field)} // Llama a la función renderBody para generar el cuerpo de la columna
    onCellEditInit={(e) => seteditando(true)}/>;
})} 
 </DataTable>          
</Panel>   
    </>
)

}
export default SubGrupo;

