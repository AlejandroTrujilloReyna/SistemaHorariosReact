import React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import UnidadAcademicaService from '../services/UnidadAcademicaService';

const UnidadAcademica = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_UnidadAcademica,setclave_UnidadAcademica] = useState(0);
  const [nombre_UnidadAcademica,setnombre_UnidadAcademica] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [unidadacademicaList,setunidadacademicaList] = useState([]);
  const [filtrounidadacademica, setfiltrounidadacademica] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando, seteditando] = useState(false);
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);

  //MENSAJE DE EXITO
  const mostrarExito = (mensaje) => {
    toast.current.show({severity:'success', summary: 'Exito', detail:mensaje, life: 3000});
  }
  //MENSAJE DE ADVERTENCIA
  const mostrarAdvertencia = (mensaje) => {
      toast.current.show({severity:'warn', summary: 'Advertencia', detail:mensaje, life: 3000});
  }
  //MENSAJE DE ERROR
  const mostrarError = (mensaje) => {
    toast.current.show({severity:'error', summary: 'Error', detail:mensaje, life: 3000});
  }    

  //FUNCION PARA REGISTRAR
  const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_UnidadAcademica || !nombre_UnidadAcademica) {
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UnidadAcademicaService.registrarUnidadAcademica({
      clave_UnidadAcademica:clave_UnidadAcademica,
      nombre_UnidadAcademica:nombre_UnidadAcademica
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya existente");
      }else if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");
      }else if(error.response.status === 500){
        mostrarError("Error interno del servidor");
      }     
    });
  }

  //FUNCION PARA LA CONSULTA
  const get = ()=>{
    UnidadAcademicaService.consultarUnidadAcademica().then((response)=>{//CASO EXITOSO
      setunidadacademicaList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    UnidadAcademicaService.modificarUnidadAcademica(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificacion exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");
        get();
      }else if(error.response.status === 401){
        mostrarError("Error del sistema");
      }
    });
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_UnidadAcademica(0);
    setnombre_UnidadAcademica("");
  }

  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'clave_UnidadAcademica', header: 'Clave' },
    { field: 'nombre_UnidadAcademica', header: 'Nombre' },
  ];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //ORDENAR LOS DATOS POR LA CLAVE AL INGRESAR A LA PAGINA
  useEffect(() => {
    setfiltrounidadacademica([...unidadacademicaList].sort((a, b) => a.clave_UnidadAcademica - b.clave_UnidadAcademica));
  }, [unidadacademicaList]);

  //FUNCION PARA LA BARRA DE BUSQUEDA
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
  
  //!!!EXTRAS DE MODIFICACION
  
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
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Unidad Academica" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_UnidadAcademica} maxLength={10}
                  onChange={(event)=>{
                    setclave_UnidadAcademica(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_UnidadAcademica} maxLength={255}
                  onChange={(event)=>{
                    setnombre_UnidadAcademica(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>                             
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>        
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Unidad Academica" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrounidadacademica.length ? filtrounidadacademica :unidadacademicaList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'nombre_UnidadAcademica' ? (options) => cellEditor(options): null} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>              
    </>
  )
}

export default UnidadAcademica