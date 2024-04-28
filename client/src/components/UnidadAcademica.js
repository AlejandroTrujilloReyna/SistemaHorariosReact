import React from 'react';
import { useState } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect } from 'react';
import UnidadAcademicaService from '../services/UnidadAcademicaService';

const UnidadAcademica = () => {
  const columns = [
    { field: 'clave_UnidadAcademica', header: 'Clave' },
    { field: 'nombre_UnidadAcademica', header: 'Nombre' },
  ];

  const [clave_UnidadAcademica,setclave_UnidadAcademica] = useState(0);
  const [nombre_UnidadAcademica,setnombre_UnidadAcademica] = useState("");
  const [unidadacademicaList,setunidadacademicaList] = useState([]);
  const [filtrounidadacademica, setfiltrounidadacademica] = useState([]);
  const [error, setError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [editando, seteditando] = useState(false);

  useEffect(() => {
    get();
  }, []);

  useEffect(() => {
    // Ordenar los datos por clave_UnidadAcademica al cargar la lista
    setfiltrounidadacademica([...unidadacademicaList].sort((a, b) => a.clave_UnidadAcademica - b.clave_UnidadAcademica));
  }, [unidadacademicaList]);

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = unidadacademicaList.filter((item) => {
        return (
            item.clave_UnidadAcademica.toString().includes(value) ||
            item.nombre_UnidadAcademica.toLowerCase().includes(value)
        );
    });
    
    setfiltrounidadacademica(filteredData);
  };

  const add = ()=>{
    if (!clave_UnidadAcademica || !nombre_UnidadAcademica) {
      setmensajeError("Existen campos vacios");
      setError(true);
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UnidadAcademicaService.registrarUnidadAcademica({
      clave_UnidadAcademica:clave_UnidadAcademica,
      nombre_UnidadAcademica:nombre_UnidadAcademica
    }).then(response=>{
      if (response.status === 200) {
        get();
        limpiarCampos();
        setError(false);
      }
    }).catch(error=>{
      if (error.response.status === 400) {
        setmensajeError("Clave ya existente");
        setError(true);
      }else if(error.response.status === 401){
        setmensajeError("Nombre ya existente");
        setError(true);
      }else if(error.response.status === 500){
        setmensajeError("Error interno del servidor");
        setError(true);
      }     
    });
  }

  const get = ()=>{
    UnidadAcademicaService.consultarUnidadAcademica().then((response)=>{
      setunidadacademicaList(response.data);  
    }).catch(error=>{
      if (error.response.status === 500) {
        setmensajeError("Error del sistema");
        setError(true);
      }
    });    
  }

  const put = (rowData) =>{
    UnidadAcademicaService.modificarUnidadAcademica(rowData).then(response=>{
      if(response.status === 200){
        setError(false);
      }
    }).catch(error=>{
      if(error.response.status === 401){
        setmensajeError("Nombre ya existente");
        get();
        setError(true);
      }else if(error.response.status === 401){
        setmensajeError("Error del sistema");
        setError(true);
      }
    });
  }
  const limpiarCampos = () =>{
    setclave_UnidadAcademica(0);
    setnombre_UnidadAcademica("");
  }
  
  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    return textEditor(options);
  };
  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText keyfilter={/[a-zA-Z\s]/} maxLength={255} type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
  };
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
      let { rowData, newValue, field, originalEvent: event } = e;
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
        case 'nombre_UnidadAcademica':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
            rowData[field] = newValue; put(rowData);
          }
          else{
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
      <Panel header="Registrar Unidad Academica" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_UnidadAcademica} maxLength={10}
                  onChange={(event)=>{
                    setclave_UnidadAcademica(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_UnidadAcademica} maxLength={255}
                  onChange={(event)=>{
                    setnombre_UnidadAcademica(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>                             
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>
        <div className="mx-8 mt-4">
          {error && <Message severity="error" text={mensajeError} />} 
        </div>         
      </Panel>
      
      <Panel header="Consultar Unidad Academica" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrounidadacademica.length ? filtrounidadacademica :unidadacademicaList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
            //EDICION
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'nombre_UnidadAcademica' ? (options) => cellEditor(options): null} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>              
    </>
  )
}

export default UnidadAcademica