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
import PlanEstudiosService from '../services/PlanEstudiosService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';

const PlanEstudios = () => {
  //VARIABLES PARA EL REGISTRO
  const [nombre_PlanEstudios, setnombre_PlanEstudios] = useState("");
  const [cant_semestres, setcant_semestres] = useState(0);
  const [clave_ProgramaEducativo, setclave_ProgramaEducativo] = useState(0);

  //VARIABLES PARA LA CONSULTA
  const [planestudiosList, setplanestudiosList] = useState([]);
  const [filtroplanestudios, setfiltroplanestudios] = useState([]);
  const [ProgramasEducativos, setProgramasEducativos] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);
    
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);

  //MENSAJE DE EXITO
  const mostrarExito = (mensaje) => {
    toast.current.show({ severity: 'success', summary: 'Exito', detail: mensaje, life: 3000 });
  }

  //MENSAJE DE ADVERTENCIA
  const mostrarAdvertencia = (mensaje) => {
    toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: mensaje, life: 3000 });
  }

  //MENSAJE DE ERROR
  const mostrarError = (mensaje) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  }

  //FUNCION PARA REGISTRAR
  const add = () => {
  //VALIDACION DE CAMPOS VACIOS
  if (!nombre_PlanEstudios || !clave_ProgramaEducativo || !cant_semestres) {
    mostrarAdvertencia("Existen campos vacios");
    return;
  }

  //MANDAR A LLAMAR AL REGISTRO SERVICE
  PlanEstudiosService.registrarPlanEstudios({
    nombre_PlanEstudios: nombre_PlanEstudios,
    cant_semestres:cant_semestres,
    clave_ProgramaEducativo: clave_ProgramaEducativo
    }).then(response => {
    // Caso exitoso
    if (response.status === 200) {
      mostrarExito("Registro exitoso");
      get();
      limpiarCampos();
    }
    }).catch(error => {
        // Excepciones
        if (error.response.status === 400) {
            mostrarAdvertencia("nombre ya existente en este programa educativo");
        } else if (error.response.status === 500) {
            mostrarError("Error interno del servidor");
        }
    })
  }

 //FUNCION PARA CONSULTA
 const get = ()=>{
    PlanEstudiosService.consultarPlanestudios().then((response)=>{//CASO EXITOSO
        setplanestudiosList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }  

//FUNCION PARA LA MODIFICACION
const put = (rowData) =>{
    PlanEstudiosService.modificarPlanEstudios(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificacion exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");
        get();
      }else if(error.response.status === 500){
        mostrarError("Error del sistema");
      }
    })
  }
//!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
    const limpiarCampos = () => {
        setnombre_PlanEstudios("");
        setcant_semestres("");
        setclave_ProgramaEducativo(0);
    };
 //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_PlanEstudios', header: 'Clave' },
    {field: 'nombre_PlanEstudios', header: 'Nombre' },
    {field: 'cant_semestres', header: 'Cantidad de semestres'},
    {field: 'clave_ProgramaEducativo', header: 'Clave Programa Educativo'},          
  ];

   //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
   useEffect(() => {
    get();
  }, []); 

//FUNCION PARA LA BARRA DE BUSQUEDA
const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = planestudiosList.filter((item) => {
        return (
          item.nombre_PlanEstudios.toLowerCase().includes(value) ||
          item.clave_ProgramaEducativo.toString().includes(value) ||
          item.cant_semestres.toString().includes(value)          
        );
    });
    setfiltroplanestudios(filteredData);
  };

 //MANDAR A LLAMAR A LA LISTA DE PROGRAMA EDUCATIVO
 useEffect(() => {
    ProgramaEducativoService.consultarProgramaEducativo()
    .then(response => {
        setProgramasEducativos(response.data);
    })
    .catch(error => {
      console.error("Error fetching Plan de Estudios:", error);
    });
  }, []);

 //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
 const renderBody = (rowData, field) => {
    if (field === 'clave_ProgramaEducativo') {
      const programa = ProgramasEducativos.find((programa) => programa.clave_ProgramaEducativo === rowData.clave_ProgramaEducativo);
      return programa ? `${programa.nombre_ProgramaEducativo}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };  

 //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch(options.field){
      case 'nombre_PlanEstudios':
        return textEditor(options);
      case 'cant_semestres':
        return numberEditor(options);           
      case 'clave_ProgramaEducativo':
        return TipoProgramaEducativoEditor(options);                     
      default:
        return textEditor(options);
    }
  };


 //EDITAR TEXTO
 const textEditor = (options) => {
    return <InputText keyfilter={/^[0-9a-zA-Z\-/]*$/} type="text" value={options.value}
    onChange={(e) => { 
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

//EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
const TipoProgramaEducativoEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={ProgramasEducativos}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_ProgramaEducativo} - ${option.nombre_ProgramaEducativo}`}
            optionValue="clave_ProgramaEducativo"
            placeholder="Seleccione un Programa Educativo" 
        />
    );
  };

 //COMPLETAR MODIFICACION
 const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'nombre_PlanEstudios':
        if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }  
        break;
      case 'cant_semestres':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }           
        break;    
      case 'clave_ProgramaEducativo':
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
  
  //!!!EXTRAS CAMPOS

  const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[0-9a-zA-Z\-/]*$/;
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
            {/* Aparición de los mensajes (Toast) */}
            <Toast ref={toast} />
            {/* Panel para el registro */}
            <Panel header="Registrar Plan de Estudios" className='mt-3' toggleable>
                <div className="formgrid grid mx-8 justify-content-center">
                    <div className="field col-3">
                        <label>Nombre</label>
                        <InputText type="text" keyfilter={/^[0-9a-zA-Z\-/]*$/} value={nombre_PlanEstudios} maxLength={255}
                            onChange={(event) => {
                              if (validarTexto(event.target.value)) {
                                setnombre_PlanEstudios(event.target.value);
                              }
                            }}
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                    </div>
                    <div className="field col-5">
                        <label>Programa Educativo</label>
                        <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            value={clave_ProgramaEducativo}
                            options={ProgramasEducativos}
                            onChange={(e) => {
                                setclave_ProgramaEducativo(e.value);
                            }}
                            optionLabel="nombre_ProgramaEducativo"
                            optionValue="clave_ProgramaEducativo"
                            placeholder="Seleccione un tipo de Programa Educativo"
                        />
                    </div>
                    <div className="field col-3">
                        <label>Cantidad de semestres</label>
                        <InputText type="text" keyfilter="pint" value={cant_semestres} maxLength={2}
                            onChange={(event)=>{
                              if (validarNumero(event.target.value)) {    
                                setcant_semestres(event.target.value);
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
      <Panel header="Consultar Plan de Etudios" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtroplanestudios.length ? filtroplanestudios :planestudiosList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_PlanEstudios' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>            
    </>
        
    );
}

export default PlanEstudios;
