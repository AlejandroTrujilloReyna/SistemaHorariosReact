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
import GradoEstudioService from '../services/GradoEstudioService';

const GradoEstudio = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_GradoEstudio,setclave_GradoEstudio] = useState(0);
  const [nombre_GradoEstudio,setnombre_GradoEstudio] = useState("");
  const [horas_MinimasGradoEstudio,sethoras_MinimasGradoEstudio] = useState(0);
  const [horas_MaximasGradoEstudio,sethoras_MaximasGradoEstudio] = useState(0);
  //VARIABLES PARA LA CONSULTA
  const [gradoestudiolist,setgradoestudiolist] = useState([]);
  const [filtrogradoestudio,setfiltrogradoestudio] = useState([]);
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
  if (!nombre_GradoEstudio || !horas_MinimasGradoEstudio || !horas_MaximasGradoEstudio) {
    mostrarAdvertencia("Existen campos vacíos");
    return;
  }
  //MANDAR A LLAMAR AL REGISTRO SERVICE
  GradoEstudioService.registrarGradoEstudio({
    clave_GradoEstudio:clave_GradoEstudio,
    nombre_GradoEstudio:nombre_GradoEstudio,
    horas_MinimasGradoEstudio:horas_MinimasGradoEstudio,
    horas_MaximasGradoEstudio:horas_MaximasGradoEstudio
  }).then(response=>{//CASO EXITOSO
    if (response.status === 200) {
      mostrarExito("Registro Exitoso");
      get();
      limpiarCampos();
    }
  }).catch(error=>{//EXCEPCIONES
    if (error.response.status === 400) {
      mostrarAdvertencia("Clave ya Existente");
    } else if(error.response.status === 401){
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
    GradoEstudioService.consultarGradoEstudio().then((response)=>{//CASO EXITOSO
        setgradoestudiolist(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }


//FUNCION PARA LA MODIFICACION
const put = (rowData) =>{
    GradoEstudioService.modificarGradoEstudio(rowData).then((response)=>{//CASO EXITOSO
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
      }else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }

 //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_GradoEstudio(0);
    setnombre_GradoEstudio("")
    sethoras_MinimasGradoEstudio(0);
    sethoras_MaximasGradoEstudio(0)
  } 

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'clave_GradoEstudio', header: 'Clave' },
    { field: 'nombre_GradoEstudio', header: 'Nombre' },
    {field: 'horas_MinimasGradoEstudio', header: 'Hora Mínimas'},
    {field: 'horas_MaximasGradoEstudio', header: 'Hora Máximas'}  
  ];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);  
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = gradoestudiolist.filter((item) => {
        return (
            item.clave_GradoEstudio.toString().includes(value) ||          
            item.nombre_GradoEstudio.toLowerCase().includes(value) ||
            item.horas_MinimasGradoEstudio.toString().includes(value) ||
            item.horas_MaximasGradoEstudio.toString().includes(value) 
                    
        )
    });
    setfiltrogradoestudio(filteredData);
  };  

//!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch (options.field) {      
      case 'nombre_GradoEstudio':
        return textEditor(options);                
      case 'horas_MinimasGradoEstudio':
        return numberEditor(options);
        case 'horas_MaximasGradoEstudio':
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
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'nombre_GradoEstudio':
        if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        } 
      break;
      case 'horas_MinimasGradoEstudio':
        if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();          
        } 
      break;
case 'horas_MaximasGradoEstudio':
    if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
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
      <Panel header="Registrar Grado de Estudio" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
        
          <div className="field col-8">
          <label>Nombre*</label>
          <InputText type="text" keyfilter={/^[a-zA-Z\s]*$/} value={nombre_GradoEstudio} maxLength={255}
              onChange={(event) => {
                if (validarTexto(event.target.value)) {
                  setnombre_GradoEstudio(event.target.value);
                }        
              }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
          />              
          </div>                            
          
          <div className="field col-2">
              <label>Horas Mínimas*</label>
              <InputText type="text" keyfilter="pint" value={horas_MinimasGradoEstudio} maxLength={11}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_MinimasGradoEstudio(event.target.value);
                    }
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>  

          <div className="field col-2">
              <label>Horas Máximas*</label>
              <InputText type="text" keyfilter="pint" value={horas_MaximasGradoEstudio} maxLength={11}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_MaximasGradoEstudio(event.target.value);
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
      <Panel header="Consultar Grados de Estudios" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrogradoestudio.length ? filtrogradoestudio :gradoestudiolist} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} 
              editor={field === 'clave_GradoEstudio' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => seteditando(true)}/>;
          })}
        </DataTable>
      </Panel> 
  </>

)

}

export default GradoEstudio
