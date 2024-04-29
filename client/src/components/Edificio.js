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
import EdificioService from '../services/EdificioService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';
import UnidadAcademicaService from '../services/UnidadAcademicaService';

const Edificio = () => {
  const columns = [
    {field: 'clave_Edificio', header: 'Clave' },
    {field: 'nombre_Edificio', header: 'Nombre' },
    {field: 'clave_ProgramaEducativo', header: 'Programa Educativo' },
    {field: 'clave_UnidadAcademica', header: 'Unidad Academica' }      
  ];  

  const [clave_Edificio, setclave_Edificio] = useState("");
  const [nombre_Edificio,setnombre_Edificio] = useState("");
  const [clave_UnidadAcademica, setclave_UnidadAcademica] = useState(null);
  const [clave_ProgramaEducativo, setclave_ProgramaEducativo] = useState(null);

  const [edificiosList,setedificiosList] = useState([]);
  const [filtroEdificio, setfiltroEdificio] = useState([]);
  const [programasEducativos, setProgramasEducativos] = useState([]);
  const [unidadesAcademicas, setUnidadesAcademicas] = useState([]);
  const [original, setOriginal] = useState([]);

  const toast = useRef(null); // Referencia al componente Toast  


  useEffect(() => {
    get();
  },[]);

  useEffect(() => {
    // Ordenar los datos por clave_Edificio al cargar la lista
    setfiltroEdificio([...edificiosList].sort((a, b) => a.clave_Edificio - b.clave_Edificio));
  }, [edificiosList]);
  
  // Función para mostrar un Toast de error  
  const showErrorToastVerde = (message) => {
    toast.current.show({ severity: 'success', summary: 'Exito', detail: message, life: 2000 });
  };

  const showErrorToastNaranja = (message) => {
    toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 2000 });
  };

  const showErrorToastRojo = (message) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
  };

  //BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = edificiosList.filter((item) => {
    const programaEducativo = item.clave_ProgramaEducativo ? item.clave_ProgramaEducativo.toString() : '';
    const unidadAcademica = item.clave_UnidadAcademica ? item.clave_UnidadAcademica.toString() : '';
    const nombreProgramaEducativo = programasEducativos.find(prog => prog.clave_ProgramaEducativo === item.clave_ProgramaEducativo)?.nombre_ProgramaEducativo || '';
        const nombre_UnidadAcademica = unidadesAcademicas.find(prog => prog.clave_UnidadAcademica === item.clave_UnidadAcademica)?.nombre_UnidadAcademica || '';
        return (
            item.clave_Edificio.toString().includes(value) ||
            item.nombre_Edificio.toLowerCase().includes(value) ||
            programaEducativo.toString().includes(value) ||
            unidadAcademica.toString().includes(value) ||
            nombreProgramaEducativo.toLowerCase().includes(value) ||
            nombre_UnidadAcademica.toLowerCase().includes(value)
        );
    });
    
    setfiltroEdificio(filteredData);
  };  

  //MANDAR A LLAMAR A LA LISTA DE UNIDADES SERVICE
  useEffect(() => {
    UnidadAcademicaService.consultarUnidadAcademica()
      .then(response => {
        setUnidadesAcademicas(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);
    
  useEffect(() => {
    ProgramaEducativoService.consultarProgramaEducativo()
      .then(response => {
        setProgramasEducativos(response.data);
      })
      .catch(error => {
        console.error("Error fetching programas educativos:", error);
      });
  }, []);
  
  // Actualizar la unidad académica al cambiar el programa educativo seleccionado (INNECESARIO POR AHORA)
  useEffect(() => {
    if (clave_ProgramaEducativo) {
      const programaSeleccionado = programasEducativos.find(prog => prog.clave_ProgramaEducativo === clave_ProgramaEducativo);
      if (programaSeleccionado) {
        setclave_UnidadAcademica(programaSeleccionado.clave_UnidadAcademica);
      }
    }
  }, [clave_ProgramaEducativo, programasEducativos]);
  // Borrar el programa educativo cuando se elige una Unidad Academica que no coincide con el programa educativo actual
  useEffect(() => {
    if (clave_UnidadAcademica) {
      let claveUAC = -1;
      const programaSeleccionado = programasEducativos.find(prog => prog.clave_ProgramaEducativo === clave_ProgramaEducativo);                
      console.error("nose: "+programaSeleccionado.clave_UnidadAcademica+" talvez "+claveUAC);  
      if(programaSeleccionado.clave_UnidadAcademica !== clave_UnidadAcademica){
        setclave_ProgramaEducativo(null);
      }
    }
  }, [unidadesAcademicas,clave_UnidadAcademica]);
  //MANDAR A LLAMAR AL REGISTRO SERVICE
  const add = ()=>{
    if (!clave_Edificio || !nombre_Edificio || !clave_UnidadAcademica) {      
      showErrorToastNaranja("Existen campos vacios");
      return;
    }
    EdificioService.registrarEdificio({
      clave_Edificio:clave_Edificio,
      nombre_Edificio:nombre_Edificio,
      clave_UnidadAcademica:clave_UnidadAcademica,
      clave_ProgramaEducativo:clave_ProgramaEducativo     
    }).then(response=>{
      if (response.status === 200) {
        showErrorToastVerde("Registro Exitoso");
        limpiarCampos();
      }
    }).catch(error=>{
      if (error.response.status === 400) {        
        showErrorToastNaranja("Clave ya existente");
      }else if(error.response.status === 401){
        showErrorToastNaranja("Nombre ya existente");        
      }else if(error.response.status === 500){  
        showErrorToastRojo("Error interno del servidor");
      }     
    });
  }  

  const get = ()=>{
    EdificioService.consultarEdificio().then((response)=>{
      setedificiosList(response.data);      
    }).catch(error=>{
      if (error.response.status === 500) {
        //showErrorToastRojo("Error del sistema");
      }
    });    
  }

  const put = (rowData) =>{
    EdificioService.modificarEdificio(rowData).then((response)=>{
      if (response.status === 200) {
        showErrorToastVerde("Modificación Exitosa");        
      }
    }).catch(error=>{
      get();
      if (error.response.status === 500) {
        showErrorToastRojo("Error del sistema");
      } else if (error.response.status === 401) {
        showErrorToastRojo("El nombre ya se encuentra registrado");
      }
    });
  }

  const limpiarCampos = () =>{
    setclave_Edificio("");
    setnombre_Edificio("");
    //setclave_UnidadAcademica(null);
    setclave_ProgramaEducativo(null);
  }  

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch(options.field){
      case 'nombre_Edificio':
        return textEditor(options);        
      case 'clave_ProgramaEducativo':
        return ProgramaEducativoEditor(options);
      case 'clave_UnidadAcademica':
        return UnidadAcademicaEditor(options);
      default:
        return textEditor(options);
    }    
  };
  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={options.value} maxLength={255} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
  };

  const ProgramaEducativoEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={programasEducativos}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_ProgramaEducativo} - ${option.nombre_ProgramaEducativo}`}
            optionValue="clave_ProgramaEducativo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Programa Educativo" 
            showClear 
        />
    );
  };

  const UnidadAcademicaEditor = (options) => {
    return (
        <Dropdown
          value={options.value}
          options={unidadesAcademicas}
          onChange={(e) => options.editorCallback(e.value)}            
          optionLabel = {(option) => `${option.clave_UnidadAcademica} - ${option.nombre_UnidadAcademica}`}
          optionValue="clave_UnidadAcademica" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
          placeholder="Seleccione una Unidad Académica"
          showClear
        />
    );
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {            
      let { rowData, newValue, field, originalEvent: event } = e;                       
      console.error("data1: "+original+" data2: "+newValue);      
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO        
        case 'nombre_Edificio':
          if (newValue.trim().length > 0 && newValue !== original){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{        
            get();                          
            event.preventDefault();
          } 
          break;
        case 'clave_ProgramaEducativo':
          if (newValue !== original){             
            rowData[field] = newValue;
            put(rowData);                       
          }else{
            get();
            event.preventDefault();
          } 
          break;
        case 'clave_UnidadAcademica':
            if (newValue > 0 && newValue !== null && newValue !== original){ 
              rowData[field] = newValue;
              put(rowData);              
            }else{
              get();
              event.preventDefault();
            } 
            break;
        default:
          break;
      }
      setOriginal(null);
  }; 

  // Define una función independiente para el cuerpo de la columna
  const renderBody = (rowData, field) => {
    if (field === 'clave_UnidadAcademica') {
      const unidad = unidadesAcademicas.find((unidad) => unidad.clave_UnidadAcademica === rowData.clave_UnidadAcademica);
      return unidad ? `${unidad.clave_UnidadAcademica} - ${unidad.nombre_UnidadAcademica}` : '';
    } else if (field === 'clave_ProgramaEducativo') {
      const programa = programasEducativos.find((programa) => programa.clave_ProgramaEducativo === rowData.clave_ProgramaEducativo);
      return programa ? `${programa.clave_ProgramaEducativo} - ${programa.nombre_ProgramaEducativo}` : '';
    } else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  const onCellEditInit = (e) => {
    console.error(""+e);
    setOriginal(e.rowData[e.field]);
  }
  return (
    <>
      <Toast ref={toast} />
      <Panel header="Registrar Edificio" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={clave_Edificio} maxLength={10}
                  onChange={(event)=>{
                    setclave_Edificio(event.target.value);
                  }} 
                  placeholder="Ej.6" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={nombre_Edificio} maxLength={255}
                  onChange={(event)=>{
                    setnombre_Edificio(event.target.value);
                  }}  
                  placeholder="Ej.Laboratorio de LSC" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div> 
          <div className="field col-6">
              <label>Programa Educativo</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_ProgramaEducativo} 
              options={programasEducativos} 
              onChange={(e) => {
                setclave_ProgramaEducativo(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel = {(option) => `${option.clave_ProgramaEducativo} - ${option.nombre_ProgramaEducativo}`}
              optionValue="clave_ProgramaEducativo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Programa Educativo" 
              showClear
            />
          </div>         
          <div className="field col-6">
              <label>Unidad Academica</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_UnidadAcademica} 
              options={unidadesAcademicas} 
              onChange={(e) => {
                setclave_UnidadAcademica(e.value);
              }} 
              
              //optionLabel="nombre_UnidadAcademica" 
              optionLabel = {(option) => `${option.clave_UnidadAcademica} - ${option.nombre_UnidadAcademica}`}
              optionValue="clave_UnidadAcademica" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una Unidad Académica"
              showClear 
            />
          </div>                                                                           
        </div>
        <div className="mx-8 mt-4">
                <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      <Panel header="Consultar Edificio" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroEdificio.length ? filtroEdificio :edificiosList} size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'clave_Edificio' ? null : (options) => cellEditor(options)}
              onCellEditInit={onCellEditInit}
              onCellEditComplete={onCellEditComplete}
              body={(rowData) => renderBody(rowData, field)} // Llama a la función renderBody para generar el cuerpo de la columna
              />;
          })}
        </DataTable>          
      </Panel>     
    </>
  )
}

export default Edificio