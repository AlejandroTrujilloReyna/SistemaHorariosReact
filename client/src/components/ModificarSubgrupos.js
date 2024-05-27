import React from 'react'
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { mostrarExito, mostrarAdvertencia, mostrarError } from '../services/ToastService';
import ModificarSubgruposService from '../services/ModificarSubgruposService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';

const ModificarSubgrupos = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_ProgramaEducativo,setclave_ProgramaEducativo] = useState(null);
  const [clave_UnidadAprendizajePlanEstudios,setclave_UnidadAprendizajePlanEstudios] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [modificarsubgruposList, setmodificarsubgruposList] = useState([]);
  const [filtroModificarSubgrupos, setfiltroModificarSubgrupos] = useState([]);
  const [programaseducativos, setprogramaseducativos] = useState([]);
  const [unidadesaprenizajeplanesestudios, setunidadesaprenizajeplanesestudios] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);  
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);

  //FUNCION PARA REGISTRAR
  const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_ProgramaEducativo || !clave_UnidadAprendizajePlanEstudios) {
      mostrarAdvertencia(toast, "Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    ModificarSubgruposService.registrarModificarSubgrupos({
      clave_ProgramaEducativo:clave_ProgramaEducativo,
      clave_UnidadAprendizajePlanEstudios:clave_UnidadAprendizajePlanEstudios 
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito(toast, "Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia(toast, "Registro ya existente");
      }else if(error.response.status === 500){          
        mostrarError(toast, "Error interno del servidor");
      }     
    });
  }

  //FUNCION PARA CONSULTA
  const get = ()=>{
    ModificarSubgruposService.consultarModificarSubgrupos().then((response)=>{//CASO EXITOSO
      setmodificarsubgruposList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("toast, Error del sistema");
      }
    });    
  }
  
  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    ModificarSubgruposService.modificarModificarSubgrupos(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito(toast, "Modificación Exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 400){
        mostrarAdvertencia(toast, "Registro ya existente");
        get();
      }else if(error.response.status === 500){
        mostrarError(toast, "Error del sistema");
      }
    })
  }  
  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_ProgramaEducativo(null);
    setclave_UnidadAprendizajePlanEstudios(null);
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_ModificarSubgrupos', header: 'Clave' },
    {field: 'clave_ProgramaEducativo', header: 'Programa Educativo' },
    {field: 'clave_UnidadAprendizajePlanEstudios', header: 'Unidad de Aprendizaje'}
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = modificarsubgruposList.filter((item) => {
        return (
            item.clave_ModificarSubgrupos.toString().includes(value) ||
            item.clave_ProgramaEducativo.toString().includes(value) ||
            item.clave_UnidadAprendizajePlanEstudios.toString().includes(value)          
        );
    });
    setfiltroModificarSubgrupos(filteredData);
  };   

  //MANDAR A LLAMAR A LA LISTA DE PROGRAMAS EDUCATIVOS
  useEffect(() => {
    ProgramaEducativoService.consultarProgramaEducativo()
      .then(response => {
        setprogramaseducativos(response.data);
      })
      .catch(error => {
        console.error("Error fetching programas educativos:", error);
      });
   }, []);
   
  //MANDAR A LLAMAR A LA LISTA DE UNIDADES DE APRENDIZAJE DE UN PLAN DE ESTUDIOS
  useEffect(() => {
    ModificarSubgruposService.obtenerUAPE()
      .then(response => {
        setunidadesaprenizajeplanesestudios(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades de aprendizaje de un plan de estudios:", error);
      });
   }, []);
   
  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_ProgramaEducativo') {
      const programa = programaseducativos.find((programa) => programa.clave_ProgramaEducativo === rowData.clave_ProgramaEducativo);
      return programa ? `${programa.nombre_ProgramaEducativo}` : '';
    }else if(field === 'clave_UnidadAprendizajePlanEstudios'){
      const uap = unidadesaprenizajeplanesestudios.find((uap) => uap.clave_UnidadAprendizajePlanEstudios === rowData.clave_UnidadAprendizajePlanEstudios);
      return uap ? `${uap.clave_UnidadAprendizaje}` : '';      
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch (options.field) {
      case 'clave_ProgramaEducativo':
        return ProgramaEducativoEditor(options);
      case 'clave_UnidadAprendizajePlanEstudios':
        return UnidadAprendizajePlanEstudiosEditor(options);
      default:
        return 0;
    }
  };

  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'clave_ProgramaEducativo':
        if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }
        else{
          event.preventDefault();
        } 
        break;
      case 'clave_UnidadAprendizajePlanEstudios':
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

  //EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
  const ProgramaEducativoEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={programaseducativos}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_ProgramaEducativo" 
                optionValue="clave_ProgramaEducativo"
                placeholder="Selecciona un Programa Educativo" 
      />
    );
  };
  
  //EDITAR DROPDOWN (UNIDAD DE APRENDIZAJE PLAN DE ESTUDIOS)
  const UnidadAprendizajePlanEstudiosEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={unidadesaprenizajeplanesestudios}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="clave_UnidadAprendizaje" 
                optionValue="clave_UnidadAprendizajePlanEstudios"
                placeholder="Selecciona una Unidad de Aprendizaje" 
      />
    );
  };

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
    <Panel header="Registrar Modificar Subgrupo" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-6">
              <label>Programa Educativo*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_ProgramaEducativo} 
              options={programaseducativos} 
              onChange={(e) => {
                setclave_ProgramaEducativo(e.value);
              }} 
              optionLabel="nombre_ProgramaEducativo" 
              optionValue="clave_ProgramaEducativo"
              placeholder="Seleccione un Programa Educativo" 
            />
          </div>
          <div className="field col-6">
              <label>Unidad de Aprendizaje*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_UnidadAprendizajePlanEstudios} 
              options={unidadesaprenizajeplanesestudios} 
              onChange={(e) => {
                setclave_UnidadAprendizajePlanEstudios(e.value);
              }} 
              optionLabel="clave_UnidadAprendizaje" 
              optionValue="clave_UnidadAprendizajePlanEstudios"
              placeholder="Seleccione una Unidad de Aprendizaje" 
            />
          </div>                                                                                      
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
    </Panel>
    {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
    <Panel header="Consultar Modificar Subgrupo" className='mt-3' toggleable>
    <div className="mx-8 mb-4">
      <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
    </div>  
      <DataTable value={filtroModificarSubgrupos.length ? filtroModificarSubgrupos :modificarsubgruposList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
        {columns.map(({ field, header }) => {
            return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
            onCellEditInit={(e) => seteditando(true)} editor={field === 'clave_ModificarSubgrupos' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
        })}
      </DataTable>
    </Panel>             
    </>
  )
}

export default ModificarSubgrupos