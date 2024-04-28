import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import SalaService from '../services/SalaService';
import EdificiosService from '../services/EdificioService';


const Sala = () => {
  const columns = [
    {field: 'clave_Sala', header: 'Clave' },
    {field: 'nombre_Sala', header: 'Nombre' },
    {field: 'capacidad_Sala', header: 'Capacidad'},
    {field: 'validar_Traslape', header: 'Validar Traslape'},
    {field: 'nota_Descriptiva', header: 'Nota Descriptiva'},
    {field: 'clave_Edificio', header: 'Clave Edificio'},    
    {field: 'clave_TipoSala', header: 'Clave Tipo Sala'}    
  ];

  const [nombre_Sala,setnombre_Sala] = useState("");
  const [capacidad_Sala,setcapacidad_Sala] = useState(0);
  const [validar_Traslape,setvalidar_Traslape] = useState(0);
  const [nota_Descriptiva,setnota_Descriptiva] = useState("");
  const [clave_Edificio,setclave_Edificio] = useState(0);
  const [clave_TipoSala,setclave_TipoSala] = useState(0);

  const [salaList,setsalaList] = useState([]);
  const [filtrosala, setfiltrosala] = useState([]);
  const [edificios, setedificios] = useState([]);
  const [tiposalas, settiposalas] = useState([]);

  const [error, setError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  useEffect(() => {
    get();
  }, []); 
  
  useEffect(() => {
    // Ordenar los datos por clave_UnidadAcademica al cargar la lista
    setfiltrosala([...salaList].sort((a, b) => a.clave_Sala - b.clave_Sala));
  }, [salaList]);

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = salaList.filter((item) => {
        return (
          item.nombre_Sala.toLowerCase().includes(value) ||
          item.capacidad_Sala.toString().includes(value) ||
          item.validar_Traslape.toString().includes(value) ||
          item.nota_Descriptiva.toLowerCase().includes(value) ||
          item.clave_Edificio.toString().includes(value) ||
          item.clave_TipoSala.toString().includes(value)          
        );
    });

    setfiltrosala(filteredData);
  };  
  
  //MANDAR A LLAMAR A LA LISTA DE EDIFICIOS SERVICE
  useEffect(() => {
    SalaService.consultarTiposala()
    .then(response => {
      settiposalas(response.data);
    })
    .catch(error => {
      console.error("Error fetching tiposala:", error);
    });
    EdificiosService.consultarEdificio()
      .then(response => {
        setedificios(response.data);
      })
      .catch(error => {
        console.error("Error fetching edificios:", error);
      });
  }, []); 

  const add = ()=>{
    if (!nombre_Sala || !capacidad_Sala || !clave_Edificio || !clave_TipoSala) {
      setmensajeError("Existen campos vacios");
      setError(true);
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    SalaService.registrarSala({
      nombre_Sala:nombre_Sala,
      capacidad_Sala:capacidad_Sala,
      validar_Traslape:validar_Traslape,
      nota_Descriptiva:nota_Descriptiva,
      clave_Edificio:clave_Edificio,
      clave_TipoSala:clave_TipoSala
    }).then(response=>{
      if(response.status === 200){
        get();
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
    })
  }

  const get = ()=>{
    SalaService.consultarSala().then((response)=>{
      setsalaList(response.data);  
    }).catch(error=>{
      if (error.response.status === 500) {
        setmensajeError("Error del sistema");
        setError(true);
      }
    });    
  }  

  const limpiarCampos = () =>{
    setnombre_Sala("");
    setcapacidad_Sala(0);
    setvalidar_Traslape(0);
    setnota_Descriptiva("");
    setclave_Edificio(0);
    setclave_TipoSala(0);
  }  

  return (
    <>
      <Panel header="Registrar Sala" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-3">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_Sala} maxLength={255}
                  onChange={(event)=>{
                    setnombre_Sala(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>
          <div className="field col-2">
              <label>Capacidad</label>
              <InputText type="text" keyfilter="pint" value={capacidad_Sala} maxLength={10}
                  onChange={(event)=>{
                    setcapacidad_Sala(event.target.value);
                    setError(false);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Validar Traslape</label>
              <ToggleButton
                invalid
                onLabel="Si"
                onIcon="pi pi-check" 
                offIcon="pi pi-times" 
                checked={validar_Traslape === 1} 
                onChange={(e) => setvalidar_Traslape(e.value ? 1 : 0)} 
                className="w-8rem" 
            />
          </div>
          <div className="field col-5">
            <label>Edificio</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_Edificio} 
              options={edificios} 
              onChange={(e) => {
                setclave_Edificio(e.value);
                setError(false);
              }} 
              optionLabel="nombre_Edificio" 
              optionValue="clave_Edificio" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un edificio" 
            />
          </div>
          <div className="field col-5">
            <label>Tipo de Sala</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_TipoSala} 
              options={tiposalas} 
              onChange={(e) => {
                setclave_TipoSala(e.value);
                setError(false);
              }} 
              optionLabel="nombre_TipoSala" 
              optionValue="clave_TipoSala" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un tipo de sala" 
            />
          </div>          
          <div className="field col">
              <label>Nota</label>
              <InputTextarea type="text" value={nota_Descriptiva} maxLength={100}
                  onChange={(event)=>{
                    setnota_Descriptiva(event.target.value);
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

      <Panel header="Consultar Sala" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrosala.length ? filtrosala :salaList} size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable key={field} field={field} header={header} style={{ width: '15%' }}/>;
          })}
        </DataTable>
      </Panel>            
    </>
  )
}

export default Sala