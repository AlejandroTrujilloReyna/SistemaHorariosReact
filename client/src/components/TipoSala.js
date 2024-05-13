import React from 'react'
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import TipoSalaService from '../services/TipoSalaService'

const TipoSala = () => {
//VARIABLES PARA EL REGISTRO  
  const [nombre_TipoSala,setnombre_TipoSala] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [tipoSalaList,settipoSalaList] = useState([]);
  const [filtroTipoSala, setfiltroTipoSala] = useState([]);
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
    if (!nombre_TipoSala) {      
      mostrarAdvertencia("Existen campos obligatorios vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    TipoSalaService.registrarTipoSala({
      nombre_TipoSala:nombre_TipoSala           
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro Exitoso");
        limpiarCampos();
        get();
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");        
      }else if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }     
    });
  }
  //FUNCION PARA CONSULTA
  const get = ()=>{
    TipoSalaService.consultarTipoSala().then((response)=>{//CASO EXITOSO
        settipoSalaList(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    TipoSalaService.modificarTipoSala(rowData).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación Exitosa");        
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("El nombre ya se encuentra registrado");
        get();
      }else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setnombre_TipoSala("");
  } 

  //!!!EXTRAS DE CONSULTA
  
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_TipoSala', header: 'Clave' },          
    {field: 'nombre_TipoSala', header: 'Tipo Sala' }
  ];

  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  },[]);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = tipoSalaList.filter((item) => {
        return (
            item.clave_TipoSala.toString().includes(value) ||
            item.nombre_TipoSala.toLowerCase().includes(value)
        );
    });
    setfiltroTipoSala(filteredData);
  };  

    //ACTIVAR EDICION DE CELDA
    const cellEditor = (options) => {
        seteditando(true);        
        return textEditor(options);        
    };
    
    //EDITAR TEXTO
    const textEditor = (options) => {
        return <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={options.value} maxLength={255} 
        onChange={(e) => { 
          if (validarTexto(e.target.value)) { 
            options.editorCallback(e.target.value)
          }
        }}
        onKeyDown={(e) => e.stopPropagation()} />;
    };
    //COMPLETAR MODIFICACION
    const onCellEditComplete = (e) => {            
        let { rowData, newValue, field, originalEvent: event } = e;                          
        switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO        
        case 'nombre_TipoSala':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
            }else{                             
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
    return regex.test(value);
  };

  return (
    <>
        {/*APARICION DE LOS MENSAJES (TOAST)*/}
        <Toast ref={toast}/>        
        <Panel header="Registrar Tipo Sala" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8">          
          <div className="field col-12">
              <label>Nombre*</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={nombre_TipoSala} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setnombre_TipoSala(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Aula Audiovisual" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div>                                                                                     
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Tipo Sala" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroTipoSala.length ? filtroTipoSala :tipoSalaList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'clave_TipoSala' ? null : (options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              />;
          })}
        </DataTable>          
      </Panel>     
    </>
  )
}

export default TipoSala