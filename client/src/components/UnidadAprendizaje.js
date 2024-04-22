import React from 'react';
import { useState } from "react";
import { useEffect } from 'react'; 
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';

const UnidadAprendizaje = () => {
  const [clave_UnidadAprendizaje,setclave_UnidadAprendizaje] = useState(0);
  const [nombre_UnidadAprendizaje,setnombre_UnidadAprendizaje] = useState("");
  const [semestre,setsemestre] = useState(0);
  const [clave_PlanEstudios,setclave_PlanEstudios] = useState("");
  const [error, setError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [planesdeestudios, setplanesdeestudios] = useState([]);

  useEffect(() => {
    UnidadAprendizajeService.consultarPlandeestudios()
      .then(response => {
        setplanesdeestudios(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);  



  const add = ()=>{
    if (!clave_UnidadAprendizaje || !nombre_UnidadAprendizaje || !semestre || !clave_PlanEstudios) {
      setmensajeError("Existen campos vacios");
      setError(true);
      return;
    }
    
    UnidadAprendizajeService.registrarUnidadAprendizaje({
    
      clave_UnidadAprendizaje:clave_UnidadAprendizaje,
      nombre_UnidadAprendizaje:nombre_UnidadAprendizaje,
      semestre:semestre,
      clave_PlanEstudios:clave_PlanEstudios

    }).then(response=>{
      if (response.status === 200) {
        limpiarCampos();
        setError(false);
      }
    }).catch(error=>{
      if (error.response.status === 400) {
        setmensajeError("Clave ya existente");
        setError(true);
      }else if(error.response.status === 500){
        setmensajeError("Error interno del servidor");
        setError(true);
      }
      else if(error.response.status === 401){
        setmensajeError("El nombre de la Unidad de Aprendizaje ya existe");
        setError(true);
      }      
    });
  }
  const limpiarCampos = () =>{
    setclave_UnidadAprendizaje(0);
    setnombre_UnidadAprendizaje("");
    setsemestre(0);
    setclave_PlanEstudios("");
  }  

  return (
    <>
      <Panel header="Registrar Unidad Aprendizaje" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-2">
                  <label>Clave</label>
                  <InputText type="text" keyfilter="pint" value={clave_UnidadAprendizaje} maxLength={6}
                      onChange={(event)=>{
                        setclave_UnidadAprendizaje(event.target.value);
                        setError(false);
                      }}  
                  className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
          <label>Nombre</label>
          <InputText type="text" keyfilter={/^[a-zA-Z\s]*$/} value={nombre_UnidadAprendizaje} maxLength={255}
              onChange={(event) => {
                  setnombre_UnidadAprendizaje(event.target.value);
                  setError(false);
              }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
          />              
          </div>                            
          <div className="field col-2">
            <label>Semestre</label>
              <InputText type="text" keyfilter="pint" value={semestre} maxLength={2}
                onChange={(event) => {
                    setsemestre(event.target.value);
                    setError(false);
                }}  
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>
          <div className="field col-4">
            <label>Plan de Estudios</label>
              <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={clave_PlanEstudios} 
                options={planesdeestudios}  
                onChange={(e) => {
                  setclave_PlanEstudios(e.value);
                  setError(false);
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
        <div className="mx-8 mt-4">
          {error && <Message severity="error" text={mensajeError} />} 
        </div>         
      </Panel>
      <Panel header="Consultar Unidad Aprendizaje" className='mt-3' toggleable></Panel>              
  </>
  
  
  )


}


export default UnidadAprendizaje