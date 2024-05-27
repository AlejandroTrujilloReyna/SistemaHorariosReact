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
import UnidadAprendizajePlanEstudiosService from '../services/UnidadAprendizajePlanEstudiosService';
import EtapaService from '../services/EtapaService';
import ClasificacionUnidadAprendizajeService from '../services/ClasificacionUnidadAprendizajeService';
import PlanEstudiosService from '../services/PlanEstudiosService';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';

const UnidadAprendizajePlanEstudios = () => {

 //VARIABLES PARA EL REGISTRO
 //const [no_EmpleadoDocente, setno_EmpleadoDocente] = useState("");
 const [semestre,setsemestre] = useState("");
 const [clave_ClasificacionUnidadAprendizaje,setclave_ClasificacionUnidadAprendizaje] = useState(null);
 const [clave_Etapa,setclave_Etapa] = useState(null);
 const [clave_PlanEstudios, setclave_PlanEstudios] = useState(null);
 const [clave_UnidadAprendizaje, setclave_UnidadAprendizaje] = useState(null);
 //VARIABLES PARA LA CONSULTA
 const [unidadaprendizajeplanestudioslist,setunidadaprendizajeplanestudioslist] = useState([]);
 const [filtroUnidadAprendizajePlanEstudios, setfiltroUnidadAprendizajePlanEstudios] = useState([]);
 const [clasificacionesunidadaprendizaje, setclasificacionesunidadaprendizaje] = useState([]);
 const [etapas, setetapas] = useState([]);
 const [planestudios, setplanestudios] = useState([]);
 const [unidadesaprendizaje, setunidadesaprendizaje] = useState([]);
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
    if (!semestre || !clave_ClasificacionUnidadAprendizaje || !clave_Etapa || !clave_PlanEstudios || !clave_UnidadAprendizaje) {      
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UnidadAprendizajePlanEstudiosService.registrarUnidadAprendizajePlanEstudios({
      semestre:semestre,
      clave_ClasificacionUnidadAprendizaje:clave_ClasificacionUnidadAprendizaje,
      clave_Etapa:clave_Etapa,
      clave_PlanEstudios:clave_PlanEstudios,
      clave_UnidadAprendizaje:clave_UnidadAprendizaje   
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }     
    });
  }  


  //FUNCION PARA CONSULTA
  const get = ()=>{
    UnidadAprendizajePlanEstudiosService.consultarUnidadAprendizajePlanEstudios().then((response)=>{//CASO EXITOSO
      setunidadaprendizajeplanestudioslist(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }


  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    UnidadAprendizajePlanEstudiosService.modificarUnidadAprendizajePlanEstudios(rowData).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación Exitosa");        
      }
    }).catch(error=>{//EXCEPCIONES
     if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }

  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setsemestre("");
    setclave_ClasificacionUnidadAprendizaje(null);
    setclave_Etapa(null);
    setclave_PlanEstudios(null);
    setclave_UnidadAprendizaje(null);
  } 

//!!!EXTRAS DE CONSULTA
//COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_UnidadAprendizajePlanEstudios', header: 'clave' },
    {field: 'semestre', header: 'Semestre' },
    {field: 'clave_ClasificacionUnidadAprendizaje', header: 'Clasificacion' },
    {field: 'clave_Etapa', header: 'Etapa' },
    {field: 'clave_PlanEstudios', header: 'Plan de estudios' },
    {field: 'clave_UnidadAprendizaje', header: 'Unidad de Aprendizaje' },
   
  ];

   //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
   useEffect(() => {
    get();
  },[]);
  
//FUNCION PARA LA BARRA DE BUSQUEDA
const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = unidadaprendizajeplanestudioslist.filter((item) => {
    
    const nombreClasifi = clasificacionesunidadaprendizaje.find(clasi => clasi.clave_ClasificacionUnidadAprendizaje === item.clave_ClasificacionUnidadAprendizaje)?.nombre_ClasificacionUnidAdaprendizaje || '';
    const nombre_Etapa = etapas.find(etap => etap.clave_Etapa === item.clave_Etapa)?.nombre_Etapa || '';  
    const nombre_PlanEs = planestudios.find(plan => plan.clave_PlanEstudios === item.clave_PlanEstudios)?.nombre_PlanEstudios || '';
    const nombre_UnidadAprend = unidadesaprendizaje.find(unidad => unidad.clave_UnidadAprendizaje === item.clave_UnidadAprendizaje)?.nombre_UnidadAprendizaje || '';
        return (
        item.semestre.toString().includes(value) ||
        nombreClasifi.toLowerCase().includes(value) ||
        nombre_Etapa.toLowerCase().includes(value) ||
        nombre_PlanEs.toLowerCase().includes(value)  ||
        nombre_UnidadAprend.toLowerCase().includes(value)  
        );
    });
    setfiltroUnidadAprendizajePlanEstudios(filteredData);
  };  

 //MANDAR A LLAMAR A LA LISTA DE CLASIFICACION DE UNIDAD DE APRENDIZAJE
 useEffect(() => {
    ClasificacionUnidadAprendizajeService.consultarClasificacionUnidadAprendizaje()
      .then(response => {
        setclasificacionesunidadaprendizaje(response.data);
      })
      .catch(error => {
        console.error("Error fetching clasificacion:", error);
      });
  }, []);
  
 //MANDAR A LLAMAR A LA LISTA DE ETAPAS
 useEffect(() => {
    EtapaService.consultarEtapa()
      .then(response => {
        setetapas(response.data);
      })
      .catch(error => {
        console.error("Error fetching Etapas:", error);
      });
  }, []);

 //MANDAR A LLAMAR A LA LISTA DE PLAN DE ESTUDIOS
 useEffect(() => {
    PlanEstudiosService.consultarPlanestudios()
      .then(response => {
        setplanestudios(response.data);
      })
      .catch(error => {
        console.error("Error plan de estudios:", error);
      });
  }, []);

 //MANDAR A LLAMAR A LA LISTA DE UNIDADES DE APRENDIZAJE
 useEffect(() => {
   UnidadAprendizajeService.consultarUnidadAprendizaje()
      .then(response => {
        setunidadesaprendizaje(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades de aprendizaje:", error);
      });
  }, []);

//FUNCION PARA QUE SE MUESTRE LA INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
const renderBody = (rowData, field) => {
    if (field === 'clave_ClasificacionUnidadAprendizaje') {
      const clasi = clasificacionesunidadaprendizaje.find((clasi) => clasi.clave_ClasificacionUnidAdaprendizaje === rowData.clave_ClasificacionUnidadAprendizaje);
      return clasi ? `${clasi.nombre_ClasificacionUnidAdaprendizaje} ` : '';
    } else if (field === 'clave_Etapa') {
      const eta = etapas.find((eta) => eta.clave_Etapa === rowData.clave_Etapa);
      return eta ? `${eta.nombre_Etapa} ` : '';
    } else if (field === 'clave_PlanEstudios') {
        const plan = planestudios.find((plan) => plan.clave_PlanEstudios === rowData.clave_PlanEstudios);
        return plan ? `${plan.nombre_PlanEstudios} ` : '';
    } else if (field === 'clave_UnidadAprendizaje') {
        const unid = unidadesaprendizaje.find((unid) => unid.clave_UnidadAprendizaje === rowData.clave_UnidadAprendizaje);
        return unid ? `${unid.nombre_UnidadAprendizaje} ` : '';
    } else {
      return rowData[field];
    }
  };


//!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch (options.field) {
        case 'semestre':
            return numberEditor(options);
      case 'clave_ClasificacionUnidadAprendizaje':
        return ClasificacionUnidadAprendizajeEditor(options);
      case 'clave_Etapa':
        return EtapaEditor(options);
        case 'clave_PlanEstudios':
            return PlanEstudiosEditor(options);
          case 'clave_UnidadAprendizaje':
            return UnidadAprendizajeEditor(options);     
      default:
        return 0;
    }
  };

//EDITAR NUMEROS
const numberEditor = (options) => {
    return <InputText keyfilter="int"  type="text" maxLength={2} value={options.value} 
    onChange={(e) => {
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }} onKeyDown={(e) => e.stopPropagation()} />;
  };

//EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
const ClasificacionUnidadAprendizajeEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={clasificacionesunidadaprendizaje}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel="nombre_ClasificacionUnidAdaprendizaje"
            optionValue="clave_ClasificacionUnidAdaprendizaje" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione el tipo de Clasificacion"             
        />
    );
  };


//EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
const EtapaEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={etapas}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel="nombre_Etapa"
            optionValue="clave_Etapa" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione el tipo de Etapa"             
        />
    );
  };


//EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
const PlanEstudiosEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={planestudios}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel="nombre_PlanEstudios"
            optionValue="clave_PlanEstudios" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione el Plan e estudios"             
        />
    );
  };

  
//EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
const UnidadAprendizajeEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={unidadesaprendizaje}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel="nombre_UnidadAprendizaje"
            optionValue="clave_UnidadAprendizaje" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione la Unidad de Aprendizaje"             
        />
    );
  };

    //COMPLETAR MODIFICACION
    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        switch (field) {
          //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
          case 'semestre':
            if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
              rowData[field] = newValue; 
              put(rowData);
            }else{
              event.preventDefault();
            }
            break;
          case 'clave_ClasificacionUnidadAprendizaje':
            if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
              rowData[field] = newValue; 
              put(rowData);
            }else{
              event.preventDefault();
            }
            break;  
            case 'clave_Etapa':
                if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
                  rowData[field] = newValue; 
                  put(rowData);
                }else{
                  event.preventDefault();
                }
                break;
              case 'clave_PlanEstudios':
                if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
                  rowData[field] = newValue; 
                  put(rowData);
                }else{
                  event.preventDefault();
                }
                break;  
                case 'clave_UnidadAprendizaje':
                    if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
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
      <Panel header="Registrar Docente" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8 justify-content-center">
        <div className="field col-3">
            <label>Unidad de Aprendizaje*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_UnidadAprendizaje} 
              options={unidadesaprendizaje} 
              onChange={(e) => {
                setclave_UnidadAprendizaje(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel="nombre_UnidadAprendizaje" 
              optionValue="clave_UnidadAprendizaje" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione la Unidad de Aprendizaje"               
            />
          </div>
          <div className="field col-3">
            <label>Plan de Estudios*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_PlanEstudios} 
              options={planestudios} 
              onChange={(e) => {
                setclave_PlanEstudios(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel="nombre_PlanEstudios" 
              optionValue="clave_PlanEstudios" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione el Plan de Estudios"               
            />
          </div>
          <div className="field col-5">
            <label>Clasificacion*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_ClasificacionUnidadAprendizaje} 
              options={clasificacionesunidadaprendizaje} 
              onChange={(e) => {
                setclave_ClasificacionUnidadAprendizaje(e.value);
              }} 
              optionLabel="nombre_ClasificacionUnidAdaprendizaje" 
              optionValue="clave_ClasificacionUnidAdaprendizaje" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione el tipo de clasificacion"               
            />
          </div>
          <div className="field col-3">
            <label>Etapa*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_Etapa} 
              options={etapas} 
              onChange={(e) => {
                setclave_Etapa(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel="nombre_Etapa" 
              optionValue="clave_Etapa" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione la Etapa"               
            />
          </div>
          <div className="field col-2">
              
              
              <label>Semestre*</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={semestre} maxLength={3}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setsemestre(event.target.value);
                    }
                  }} 
                  placeholder="Ej.12345678" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          
          
          
          
                                                                  
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Unidades de aprendizaje con plan de estudios" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroUnidadAprendizajePlanEstudios.length ? filtroUnidadAprendizajePlanEstudios :unidadaprendizajeplanestudioslist} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '5%' }} editor={field === 'clave_UnidadAprendizajePlanEstudios' ? null : (options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              body={(rowData) => renderBody(rowData, field)} // Llama a la función renderBody para generar el cuerpo de la columna
              onCellEditInit={(e) => seteditando(true)}/>;
          })}
        </DataTable>          
      </Panel>     
    </>

)

}
export default UnidadAprendizajePlanEstudios