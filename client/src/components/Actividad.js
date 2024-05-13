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
import ActividadService from '../services/ActividadService';

const Actividad = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_Actividad,setclave_Actividad] = useState(0);
  const [nombre_Actividad,setnnombre_Actividad] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [actividadList,setactividadList] = useState([]);
  const [filtroActividad, setfiltroActividad] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);
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
    if (!clave_Actividad || !nombre_Actividad) {
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    ActividadService.registrarActividad({
        clave_Actividad:clave_Actividad,
        nombre_Actividad:nombre_Actividad
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
    ActividadService.consultarActividad().then((response)=>{//CASO EXITOSO
      setactividadList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }
  
  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    ActividadService.modificarActividad(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificacion exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya existente");
        get();
      }else if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");
        get();
      }else if(error.response.status === 500){
        mostrarError("Error interno del servidor");
      } 
    })
  }  
  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_Actividad(0);
    setnnombre_Actividad("");
  }

  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_Actividad', header: 'ID' },
    { field: 'clave_Actividad', header: 'Clave' },
    { field: 'nombre_Actividad', header: 'Nombre' },
  ];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = actividadList.filter((item) => {
        return (
            item.clave_Actividad.toString().includes(value) ||
            item.nombre_Actividad.toLowerCase().includes(value)
        );
    });
    setfiltroActividad(filteredData);
  };

  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch (options.field) {
      case 'clave_Actividad':
        return numberEditor(options);
      case 'nombre_Actividad':
        return textEditor(options);
      default:
        return textEditor(options);  
    }
  };
  
  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText keyfilter={/[a-zA-Z\s]/} maxLength={255} type="text" value={options.value} 
    onChange={(e) =>{ 
      if (validarTexto(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };
  
  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="int"  type="text" maxLength={6} value={options.value} 
    onChange={(e) => {
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }} onKeyDown={(e) => e.stopPropagation()} />;
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'clave_Actividad':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;         
      case 'nombre_Actividad':
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
  
  //!!!EXTRAS CAMPOS

  const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return  regex.test(value);
  };

  const validarNumero = (value) => {
    // Expresión regular para validar números enteros positivos
    const regex = /^[0-9]\d*$/;
    // Verificar si el valor coincide con la expresión regular
    return value==='' || regex.test(value);
  };
  
  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Actividad" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_Actividad} maxLength={10}
                onChange={(event) => {
                  if (validarNumero(event.target.value)) {
                    setclave_Actividad(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_Actividad} maxLength={255}
                onChange={(event) => {
                  if (validarTexto(event.target.value)) {
                    setnnombre_Actividad(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>                             
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} severity='success' />
        </div>        
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Actividad" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtroActividad.length ? filtroActividad :actividadList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} 
              editor={field === 'id_Actividad' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>                      
    </>
  )  
}

export default Actividad