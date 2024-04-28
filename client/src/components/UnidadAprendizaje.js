import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';

const UnidadAprendizaje = () => {
  const columns = [
    { field: 'clave_UnidadAprendizaje', header: 'Clave' },
    { field: 'nombre_UnidadAprendizaje', header: 'Nombre' },
    {field: 'semestre', header: 'Semestre'},
    {field: 'clave_PlanEstudios', header: 'Plan de Estudios'},
  ];

  const [clave_UnidadAprendizaje,setclave_UnidadAprendizaje] = useState(0);
  const [nombre_UnidadAprendizaje,setnombre_UnidadAprendizaje] = useState("");
  const [clave_PlanEstudios,setclave_PlanEstudios] = useState(null);
  const [semestre,setsemestre] = useState(0);

  const [unidadaprendizajeList,setunidadaprendizajeList] = useState([]);
  const [filtrounidadaprendizaje, setfiltrounidadaprendizaje] = useState([]);
  const [planesdeestudios, setplanesdeestudios] = useState([]);

  const [error, setError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  useEffect(() => {
    get();
  }, []);  

  useEffect(() => {
    // Ordenar los datos por clave_UnidadAprendizaje al cargar la lista
    setfiltrounidadaprendizaje([...unidadaprendizajeList].sort((a, b) => a.clave_UnidadAprendizaje - b.clave_UnidadAprendizaje));
  }, [unidadaprendizajeList]);
  
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = unidadaprendizajeList.filter((item) => {
        return (
            item.clave_PlanEstudios.toString().includes(value) ||
            item.clave_UnidadAprendizaje.toString().includes(value) ||
            item.nombre_UnidadAprendizaje.toLowerCase().includes(value) ||
            item.semestre.toString().includes(value)           
        )
    });

    setfiltrounidadaprendizaje(filteredData);
  };   

  //MANDAR A LLAMAR A LA LISTA DE PLANES DE ESTUDIOS
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

  const get = ()=>{
    UnidadAprendizajeService.consultarUnidadAprendizaje().then((response)=>{
      setunidadaprendizajeList(response.data);  
    }).catch(error=>{
      if (error.response.status === 500) {
        setmensajeError("Error del sistema");
        setError(true);
      }
    });    
  }

const put = (rowData) =>{
  UnidadAprendizajeService.modificarUnidadAprendizaje(rowData).then((response)=>{
    if(response.status === 200){
      setError(false);
    }
  }).catch(error=>{
    if (error.response.status === 500) {
      setmensajeError("Error del sistema");
      setError(true);
    }else if (error.response.status === 401) {
      setmensajeError("Nombre ya registrado");
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

  const cellEditor = (options) => {
    
    switch (options.field) {
      
      case 'nombre_UnidadAprendizaje':
        return textEditor(options); 
        

      case 'semestre':
        return numberEditor(options);
        

      case 'clave_PlanEstudios':
        return PlanEstudiosEditor(options);           
       
default:
  return textEditor(options); 
    }  
  
  }

  const textEditor = (options) => {
    return <InputText keyfilter={/^[a-zA-Z\s]*$/} type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
  };

  const numberEditor = (options) => {
    return <InputText keyfilter="pint"  type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
  };

 //COMPLETAR MODIFICACION
 const onCellEditComplete = (e) => {
  let { rowData, newValue, field, originalEvent: event } = e;
  switch (field) {
    //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
    case 'nombre_UnidadAprendizaje':
      if (newValue.trim().length > 0){ 
        rowData[field] = newValue; put(rowData);
      }
      else{
        get();
        event.preventDefault();
      } 
    break;
    case 'semestre':
      if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
        rowData[field] = newValue; put(rowData);
      }
      else{
        get();
        event.preventDefault();          
      } 
    break;

    case 'clave_PlanEstudios':
      if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
        rowData[field] = newValue; put(rowData);
      }
      else{
        get();
        event.preventDefault();          
      } 
    break;

    default:
    break;
  }
};

const PlanEstudiosEditor = (options) => {
return (

<Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={planesdeestudios}  
                onChange={(e) => {
                  setclave_PlanEstudios(e.value);
                  setError(false);
                }} 
                optionLabel="nombre_PlanEstudios" 
                optionValue="clave_PlanEstudios" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Selecciona un Plan de Estudios" 
              />
              );

};

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

      <Panel header="Consultar Unidad de Aprendizaje" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrounidadaprendizaje.length ? filtrounidadaprendizaje :unidadaprendizajeList} size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {

              return <Column sortable key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'clave_UnidadAprendizaje' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
          })}


        </DataTable>
      </Panel> 
  </>
  )
}


export default UnidadAprendizaje