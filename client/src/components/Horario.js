import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { mostrarExito, mostrarAdvertencia, mostrarError } from '../services/ToastService';
import HorarioService from '../services/HorarioService';
import DiaService from '../services/DiaService';
import SalaService from '../services/SalaService';

const Horario = () => {
  //VARIABLES PARA EL REGISTRO  
  const [hora_Entrada,sethora_Entrada] = useState();
  const [hora_Salida,sethora_Salida] = useState();
  const [clave_Dia,setclave_Dia] = useState(null);
  const [clave_SubGrupo,setclave_SubGrupo] = useState(null);
  const [clave_Sala,setclave_Sala] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [dias, setDias] = useState([]);
  const [subgrupos, setSubgrupos] = useState([]);
  const [salas, setSalas] = useState([]);
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);

  //FUNCION PARA REGISTRAR
  const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!hora_Entrada || !hora_Salida || !clave_Dia || !clave_SubGrupo || !clave_Sala) {
      mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    HorarioService.registrarHorario({
        hora_Entrada:hora_Entrada,
        hora_Salida:hora_Salida,
        clave_Dia:clave_Dia,
        clave_SubGrupo:clave_SubGrupo,
        clave_Sala:clave_Sala      
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito(toast,"Registro exitoso");
        //get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia(toast,"La hora de Salida debe ser posterior a la hora de Entrada");
      } else if (error.response.status === 402) {
        mostrarAdvertencia(toast,"Ya existe un Registro en ese Horario");      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }     
    });
  }  
  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    sethora_Entrada("");
    sethora_Salida("");
    setclave_Dia(null);
    setclave_SubGrupo(null);
    setclave_Sala(null);
  } 
  
  //!!!EXTRAS DE CONSULTA
  
  //MANDAR A LLAMAR A LA LISTA DE DIAS
  useEffect(() => {
    DiaService.consultarDia()
      .then(response => {
        setDias(response.data);
      })
      .catch(error => {
        console.error("Error fetching dia:", error);
      });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE DIAS
  useEffect(() => {
    HorarioService.CONSULTARSG()
      .then(response => {
        setSubgrupos(response.data);
      })
      .catch(error => {
        console.error("Error fetching subgrupos:", error);
      });
  }, []);
  
  //MANDAR A LLAMAR A LA LISTA DE DIAS
  useEffect(() => {
    SalaService.consultarSala()
      .then(response => {
        setSalas(response.data);
      })
      .catch(error => {
        console.error("Error fetching salas:", error);
      });
  }, []);  
  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
    <Panel header="Registrar Horario" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-2">            
              <label>Hora de entrada*</label>
              <InputText type="time" value={hora_Entrada} maxLength={10}
                  onChange={(event)=>{
                      sethora_Entrada(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>          
          </div>
          <div className="field col-2">
              <label>Hora de salida*</label>
              <InputText type="time" value={hora_Salida} maxLength={10}
                  onChange={(event)=>{
                      sethora_Salida(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>
          <div className="field col-3">
            <label>Día*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_Dia} 
              options={dias} 
              onChange={(e) => {
                setclave_Dia(e.value);
              }} 
              optionLabel="nombre_Dia" 
              optionValue="clave_Dia" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Día" 
            />
          </div>
          <div className="field col-3">
            <label>Subgrupo*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_SubGrupo} 
              options={subgrupos} 
              onChange={(e) => {
                setclave_SubGrupo(e.value);
              }} 
              optionLabel="clave_SubGrupo" 
              optionValue="clave_SubGrupo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Subgrupo" 
            />
          </div>
          <div className="field col-3">
            <label>Sala*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_Sala} 
              options={salas} 
              onChange={(e) => {
                setclave_Sala(e.value);
              }} 
              optionLabel="nombre_Sala" 
              optionValue="clave_Sala" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una Salas" 
            />
          </div>                                                                                               
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
      </Panel>        
    </>
  )
}

export default Horario