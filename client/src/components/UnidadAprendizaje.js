import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';
import PlanEstudiosService from '../services/PlanEstudiosService';

const UnidadAprendizaje = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_UnidadAprendizaje,setclave_UnidadAprendizaje] = useState(0);
  const [nombre_UnidadAprendizaje,setnombre_UnidadAprendizaje] = useState("");
  const [clave_PlanEstudios,setclave_PlanEstudios] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [unidadaprendizajeList,setunidadaprendizajeList] = useState([]);
  const [filtrounidadaprendizaje, setfiltrounidadaprendizaje] = useState([]);
  const [planesdeestudios, setplanesdeestudios] = useState([]);
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
    if (!clave_UnidadAprendizaje || !nombre_UnidadAprendizaje || !clave_PlanEstudios) {
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UnidadAprendizajeService.registrarUnidadAprendizaje({
      clave_UnidadAprendizaje:clave_UnidadAprendizaje,
      nombre_UnidadAprendizaje:nombre_UnidadAprendizaje,
      clave_PlanEstudios:clave_PlanEstudios
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya existente");
      } else if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");
      } else if(error.response.status === 500){
        mostrarError("Error en el sistema");   
      }  
    });
  }

  //FUNCION PARA LA CONSULTA
  const get = ()=>{
    UnidadAprendizajeService.consultarUnidadAprendizaje().then((response)=>{//CASO EXITOSO
      setunidadaprendizajeList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    UnidadAprendizajeService.modificarUnidadAprendizaje(rowData).then((response)=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificacion exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya existente");
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
    setclave_UnidadAprendizaje(0);
    setnombre_UnidadAprendizaje("");
    setclave_PlanEstudios("");
  } 
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'clave_UnidadAprendizaje', header: 'Clave' },
    { field: 'nombre_UnidadAprendizaje', header: 'Nombre' },
    {field: 'clave_PlanEstudios', header: 'Plan de Estudios'},
  ];
  
  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);  
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = unidadaprendizajeList.filter((item) => {
        return (
            item.clave_PlanEstudios.toString().includes(value) ||
            item.clave_UnidadAprendizaje.toString().includes(value) ||
            item.nombre_UnidadAprendizaje.toLowerCase().includes(value)        
        )
    });
    setfiltrounidadaprendizaje(filteredData);
  };   

  //MANDAR A LLAMAR A LA LISTA DE PLANES DE ESTUDIOS
  useEffect(() => {
    PlanEstudiosService.consultarPlanestudios()
      .then(response => {
        setplanesdeestudios(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);    

  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch (options.field) {      
      case 'nombre_UnidadAprendizaje':
        return textEditor(options);                
      case 'clave_PlanEstudios':
        return PlanEstudiosEditor(options);                  
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

  //EDITAR DROPDOWN (PLAN DE ESTUDIOS)
  const PlanEstudiosEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={planesdeestudios}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_PlanEstudios" 
                optionValue="clave_PlanEstudios" // Aquí especificamos que la clave del plan de estudios se utilice como el valor de la opción seleccionada
                placeholder="Selecciona un Plan de Estudios" 
      />
    );
  };  

 //COMPLETAR MODIFICACION
 const onCellEditComplete = (e) => {
  let { rowData, newValue, field, originalEvent: event } = e;
  switch (field) {
    //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
    case 'nombre_UnidadAprendizaje':
      if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
        rowData[field] = newValue; put(rowData);
      }else{
        event.preventDefault();
      } 
    break;
    case 'clave_PlanEstudios':
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

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_PlanEstudios') {
      const plan = planesdeestudios.find((plan) => plan.clave_PlanEstudios === rowData.clave_PlanEstudios);
      return plan ? `${plan.nombre_PlanEstudios}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
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
      <Panel header="Registrar Unidad Aprendizaje" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-2">
                  <label>Clave</label>
                  <InputText type="text" keyfilter="pint" value={clave_UnidadAprendizaje} maxLength={6}
                      onChange={(event)=>{
                        if (validarNumero(event.target.value)) {
                          setclave_UnidadAprendizaje(event.target.value);
                        }                        
                      }}  
                  className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
          <label>Nombre</label>
          <InputText type="text" keyfilter={/^[a-zA-Z\s]*$/} value={nombre_UnidadAprendizaje} maxLength={255}
              onChange={(event) => {
                if (validarTexto(event.target.value)) {
                  setnombre_UnidadAprendizaje(event.target.value);
                }        
              }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
          />              
          </div>                            
          <div className="field col-4">
            <label>Plan de Estudios</label>
              <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={clave_PlanEstudios} 
                options={planesdeestudios}  
                onChange={(e) => {
                  setclave_PlanEstudios(e.value);
                }} 
                optionLabel="nombre_PlanEstudios" 
                optionValue="clave_PlanEstudios" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Selecciona un Plan de Estudios" 
              />
          </div>
          </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>      
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Unidad de Aprendizaje" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrounidadaprendizaje.length ? filtrounidadaprendizaje :unidadaprendizajeList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_UnidadAprendizaje' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel> 
  </>
  )
}

export default UnidadAprendizaje