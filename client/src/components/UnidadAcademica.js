import React from 'react';
import { useState } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import UnidadAcademicaService from '../services/UnidadAcademicaService';

const UnidadAcademica = () => {
  const [clave_UnidadAcademica,setclave_UnidadAcademica] = useState(0);
  const [nombre_UnidadAcademica,setnombre_UnidadAcademica] = useState("");
  const [error, setError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  const add = ()=>{
    if (!clave_UnidadAcademica || !nombre_UnidadAcademica) {
      setmensajeError("Existen campos vacios");
      setError(true);
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UnidadAcademicaService.registrarUnidadAcademica({
      clave_UnidadAcademica:clave_UnidadAcademica,
      nombre_UnidadAcademica:nombre_UnidadAcademica
    }).then(response=>{
      if (response.status === 200) {
        limpiarCampos();
        setError(false);
      }
    }).catch(error=>{
      if (error.response.status === 400) {
        setmensajeError("Clave ya existente");
        setError(true);
      }else if(error.response.status === 401){
        setmensajeError("Nombre ya existente");
        setError(true);
      }else if(error.response.status === 500){
        setmensajeError("Error interno del servidor");
        setError(true);
      }     
    });
  }
  const limpiarCampos = () =>{
    setclave_UnidadAcademica(0);
    setnombre_UnidadAcademica("");
  }    
  return (
    <>
      <Panel header="Registrar Unidad Academica" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_UnidadAcademica} maxLength={10}
                  onChange={(event)=>{
                    setclave_UnidadAcademica(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_UnidadAcademica} maxLength={255}
                  onChange={(event)=>{
                    setnombre_UnidadAcademica(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>                             
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>
        <div className="mx-8 mt-4">
          {error && <Message severity="error" text={mensajeError} />} 
        </div>         
      </Panel>
      <Panel header="Consultar Unidad Academica" className='mt-3' toggleable></Panel>              
    </>
  )
}

export default UnidadAcademica