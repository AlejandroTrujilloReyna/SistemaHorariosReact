import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import TipoEmpleadoService from '../services/TipoEmpleadoService';

const TipoEmpleado = () => {
    const [clave_TipoEmpleado,setclave_TipoEmpleado] = useState(0);
    const [nombre_TipoEmpleado,setnombre_TipoEmpleado] = useState("");
    const [horas_MinimasTipoEmpleado,sethoras_MinimasTipoEmpleado] = useState(0);
    const [horas_MaximasTipoEmpleado,sethoras_MaximasTipoEmpleado] = useState(0);
  
    const [tipoempleadolist,settipoempleadolist] = useState([]);
    const [filtrotipoempleado,setfiltrotipoempleado] = useState([]);
  
    const [editando,seteditando] = useState(false);

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
    if (!nombre_TipoEmpleado || !horas_MinimasTipoEmpleado || !horas_MaximasTipoEmpleado) {
      mostrarAdvertencia("Existen campos vacíos");
      return;
    }
  //MANDAR A LLAMAR AL REGISTRO SERVICE
  TipoEmpleadoService.registrarTipoEmpleado({
    clave_TipoEmpleado:clave_TipoEmpleado,
    nombre_TipoEmpleado:nombre_TipoEmpleado,
    horas_MinimasTipoEmpleado:horas_MinimasTipoEmpleado,
    horas_MaximasTipoEmpleado:horas_MaximasTipoEmpleado
  }).then(response=>{//CASO EXITOSO
    if (response.status === 200) {
      mostrarExito("Registro Exitoso");
      get();
      limpiarCampos();
    }
  }).catch(error=>{//EXCEPCIONES
    if(error.response.status === 401){
      mostrarAdvertencia("Nombre ya Existente");
    }else if(error.response.status === 403){
      mostrarAdvertencia("Favor de Revisar las Horas");        
    } else if(error.response.status === 500){
      mostrarError("Error en el sistema");   
    }  
  });
  }

  //FUNCION PARA LA CONSULTA
  const get = ()=>{
    TipoEmpleadoService.consultarTipoEmpleado().then((response)=>{//CASO EXITOSO
        settipoempleadolist(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }


//FUNCION PARA LA MODIFICACION
const put = (rowData) =>{
    TipoEmpleadoService.modificarTipoEmpleado(rowData).then((response)=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificación Exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya Existente");
        get();
      }else if(error.response.status === 403){
        mostrarAdvertencia("Favor de Revisar las Horas");
        get();  
      }
      else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }

//!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_TipoEmpleado(0);
    setnombre_TipoEmpleado("")
    sethoras_MinimasTipoEmpleado(0);
    sethoras_MaximasTipoEmpleado(0)
  } 

   //COLUMNAS PARA LA TABLA
   const columns = [
    { field: 'clave_TipoEmpleado', header: 'Clave' },
    { field: 'nombre_TipoEmpleado', header: 'Nombre' },
    {field: 'horas_MinimasTipoEmpleado', header: 'Horas Mínimas'},
    {field: 'horas_MaximasTipoEmpleado', header: 'Horas Máximas'}  
];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);  
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = tipoempleadolist.filter((item) => {
        return (
            item.clave_TipoEmpleado.toString().includes(value) ||          
            item.nombre_TipoEmpleado.toLowerCase().includes(value) ||
            item.horas_MinimasTipoEmpleado.toString().includes(value) ||
            item.horas_MaximasTipoEmpleado.toString().includes(value) 
                    
        )
    });
    setfiltrotipoempleado(filteredData);
  };  

  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch (options.field) {      
      case 'nombre_TipoEmpleado':
        return textEditor(options);                
      case 'horas_MinimasTipoEmpleado':
        return numberEditor(options);
        case 'horas_MaximasTipoEmpleado':
        return numberEditor(options);                 
      default:
        return textEditor(options); 
    }  
  }

  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText keyfilter={/^[a-zA-Z\s]*$/} type="text"  maxLength={255} value={options.value} 
      onChange={(e) => {
        if (validarTexto(e.target.value)) {
          options.editorCallback(e.target.value)
        }
      }}
      onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="int"  type="text" maxLength={11} value={options.value} 
    onChange={(e) => {
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }} onKeyDown={(e) => e.stopPropagation()} />;
  };

 //COMPLETAR MODIFICACION
 const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
      // Función para validar y aplicar los cambios en el campo editado
    switch (field) {
        // CADA CAMPO QUE SE PUEDA MODIFICAR ES UN CASO
        case 'nombre_TipoEmpleado':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
            rowData[field] = newValue; put(rowData);
          }else{
            event.preventDefault();
          } 
            break;
        case 'horas_MinimasTipoEmpleado':
            if (newValue !== null && newValue > 0  && newValue !== rowData[field]) {
                rowData[field] = newValue; put(rowData);
            } else {
                event.preventDefault()
            }
            break;
        case 'horas_MaximasTipoEmpleado':          
            if (newValue !== null && newValue > 0 && newValue !== rowData[field]) {
                rowData[field] = newValue; put(rowData);
            } else {
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
      <Panel header="Registrar Tipo de Empleado" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
        
          <div className="field col-8">
          <label>Nombre*</label>
          <InputText type="text" keyfilter={/^[a-zA-Z\s]*$/} value={nombre_TipoEmpleado} maxLength={255}
              onChange={(event) => {
                if (validarTexto(event.target.value)) {
                  setnombre_TipoEmpleado(event.target.value);
                }        
              }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
          />              
          </div>                            
          
          <div className="field col-2">
              <label>Horas Mínimas</label>
              <InputText type="text" keyfilter="pint" value={horas_MinimasTipoEmpleado} maxLength={11}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_MinimasTipoEmpleado(event.target.value);
                    }
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>  

          <div className="field col-2">
              <label>Horas Máximas</label>
              <InputText type="text" keyfilter="pint" value={horas_MaximasTipoEmpleado} maxLength={11}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_MaximasTipoEmpleado(event.target.value);
                    }
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>

          </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>      
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Tipos de Empleados" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrotipoempleado.length ? filtrotipoempleado :tipoempleadolist} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'clave_TipoEmpleado' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel> 
  </>
    )

}

export default TipoEmpleado