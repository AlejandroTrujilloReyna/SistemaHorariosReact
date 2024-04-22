import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import EdificioService from '../services/EdificioService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';
import UnidadAcademicaService from '../services/UnidadAcademicaService';

const Edificio = () => {
  const [clave_Edificio, setclave_Edificio] = useState(null);
  const [nombre_Edificio,setnombre_Edificio] = useState("");  
  const [clave_UnidadAcademica, setclave_UnidadAcademica] = useState(null);
  const [clave_ProgramaEducativo, setclave_ProgramaEducativo] = useState(null);
  const [programasEducativos, setProgramasEducativos] = useState([]);
  const [unidadesAcademicas, setUnidadesAcademicas] = useState([]);
  const toast = useRef(null); // Referencia al componente Toast

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
  
  // Actualizar la unidad académica al cambiar el programa educativo seleccionado
  useEffect(() => {
    if (clave_ProgramaEducativo) {
      const programaSeleccionado = programasEducativos.find(prog => prog.clave_ProgramaEducativo === clave_ProgramaEducativo);
      if (programaSeleccionado) {
        setclave_UnidadAcademica(programaSeleccionado.clave_UnidadAcademica);
      }
    }
  }, [clave_ProgramaEducativo, programasEducativos]);

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
  const limpiarCampos = () =>{
    setclave_Edificio("");
    setnombre_Edificio("");
    setclave_UnidadAcademica(null);
    setclave_ProgramaEducativo(null);
  }   
  return (
    <>
    <Toast ref={toast} />
      <Panel header="Registrar Programa Educativo" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave*</label>
              <InputText type="text" keyfilter="pint" value={clave_Edificio} maxLength={10}
                  onChange={(event)=>{
                    setclave_Edificio(event.target.value);
                  }} 
                  placeholder="Ej.6" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre*</label>
              <InputText type="text" keyfilter={/[a-zA-Z\s]/} value={nombre_Edificio} maxLength={255}
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
            />
          </div>         
          <div className="field col-6">
              <label>Unidad Academica*</label>
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
            />
          </div>                                                                           
        </div>
        <div className="mx-8 mt-4">
                <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      <Panel header="Consultar Programa Educativo" className='mt-3' toggleable></Panel>     
    </>
  )
}

export default Edificio