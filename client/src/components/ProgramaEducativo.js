import React from 'react';
import Axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';

const ProgramaEducativo = () => {
  const [clave_ProgramaEducativo,setclave_ProgramaEducativo] = useState(0);
  const [nombre_ProgramaEducativo,setnombre_ProgramaEducativo] = useState("");
  const [banco_Horas,setbanco_Horas] = useState(0);
  const [min_Grupo,setmin_Grupo] = useState(0);
  const [max_Grupo,setmax_Grupo] = useState(0);
  const [clave_UnidadAcademica,setclave_UnidadAcademica] = useState(null);
  const [error, setError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [unidadesAcademicas, setUnidadesAcademicas] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/unidadesAcademicas")
      .then(response => {
        setUnidadesAcademicas(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);  

  const add = ()=>{
    Axios.post("http://localhost:3001/registrarProgramaEducativo",{
      clave_ProgramaEducativo:clave_ProgramaEducativo,
      nombre_ProgramaEducativo:nombre_ProgramaEducativo,
      banco_Horas:banco_Horas,
      min_Grupo:min_Grupo,
      max_Grupo:max_Grupo,
      clave_UnidadAcademica:clave_UnidadAcademica      
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
    });
  }  
  const limpiarCampos = () =>{
    setclave_ProgramaEducativo(0);
    setnombre_ProgramaEducativo("");
    setbanco_Horas(0);
    setmin_Grupo(0);
    setmax_Grupo(0);
    setclave_UnidadAcademica(0);
  }    
  return (
    <>
      <Panel header="Registrar Programa Educativo" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_ProgramaEducativo} maxLength={10}
                  onChange={(event)=>{
                    setclave_ProgramaEducativo(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter="alpha" value={nombre_ProgramaEducativo} maxLength={255}
                  onChange={(event)=>{
                    setnombre_ProgramaEducativo(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>
          <div className="field col-2">
              <label>Banco de horas</label>
              <InputText type="text" keyfilter="pint" value={banco_Horas} maxLength={10}
                  onChange={(event)=>{
                    setbanco_Horas(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Capacidad Minima</label>
              <InputText type="text" keyfilter="pint" value={min_Grupo} maxLength={10}
                  onChange={(event)=>{
                    setmin_Grupo(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Capacidad Maxima</label>
              <InputText type="text" keyfilter="pint" value={max_Grupo} maxLength={10}
                  onChange={(event)=>{
                    setmax_Grupo(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-6">
              <label>Unidad Academica</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_UnidadAcademica} 
              options={unidadesAcademicas} 
              onChange={(e) => {
                setclave_UnidadAcademica(e.value);
                setError(false);
              }} 
              optionLabel="nombre_UnidadAcademica" 
              optionValue="clave_UnidadAcademica" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una unidad académica" 
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
      <Panel header="Consultar Programa Educativo" className='mt-3' toggleable></Panel>     
    </>
  )
}

export default ProgramaEducativo