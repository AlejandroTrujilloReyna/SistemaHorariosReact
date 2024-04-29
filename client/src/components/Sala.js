import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { Toast } from 'primereact/toast';
import SalaService from '../services/SalaService';
import EdificiosService from '../services/EdificioService';
const Sala = () => {
  //VARIABLES PARA EL REGISTRO
  const [nombre_Sala,setnombre_Sala] = useState("");
  const [capacidad_Sala,setcapacidad_Sala] = useState(0);
  const [validar_Traslape,setvalidar_Traslape] = useState(0);
  const [nota_Descriptiva,setnota_Descriptiva] = useState("");
  const [clave_Edificio,setclave_Edificio] = useState(0);
  const [clave_TipoSala,setclave_TipoSala] = useState(0);
  //VARIABLES PARA LA CONSULTA
  const [salaList,setsalaList] = useState([]);
  const [filtrosala, setfiltrosala] = useState([]);
  const [edificios, setedificios] = useState([]);
  const [tiposalas, settiposalas] = useState([]);
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
    if (!nombre_Sala || !capacidad_Sala || !clave_Edificio || !clave_TipoSala) {
      mostrarAdvertencia("Existen campos vacios");
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
        mostrarExito("Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya existente");
      }else if(error.response.status === 500){          
        mostrarError("Error interno del servidor");
      }  
    })
  }

  //FUNCION PARA CONSULTA
  const get = ()=>{
    SalaService.consultarSala().then((response)=>{
      setsalaList(response.data);  
    }).catch(error=>{
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }  

  //FUNCION PARA LA MODIFICACION?????????????????????????????????????????
  const put = (rowData) =>{
    SalaService.modificarSala(rowData).then(response=>{//CASO EXITOSO
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
  const limpiarCampos = () =>{
    setnombre_Sala("");
    setcapacidad_Sala(0);
    setvalidar_Traslape(0);
    setnota_Descriptiva("");
    setclave_Edificio(0);
    setclave_TipoSala(0);
  };
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_Sala', header: 'Clave' },
    {field: 'nombre_Sala', header: 'Nombre' },
    {field: 'capacidad_Sala', header: 'Capacidad'},
    {field: 'validar_Traslape', header: 'Validar Traslape'},
    {field: 'nota_Descriptiva', header: 'Nota Descriptiva'},
    {field: 'clave_Edificio', header: 'Clave Edificio'},    
    {field: 'clave_TipoSala', header: 'Clave Tipo Sala'}    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []); 
  
  //ORDENAR LOS DATOS POR CLAVE AL INGRESAR A LA PAGINA
  useEffect(() => {
    setfiltrosala([...salaList].sort((a, b) => a.clave_Sala - b.clave_Sala));
  }, [salaList]);

  //FUNCION PARA LA BARRA DE BUSQUEDA
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

  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'nombre_Sala':
        if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }
        else{
          event.preventDefault();
        } 
        break;
      case 'capacidad_Sala':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;
      case 'validar_Traslape':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;
      case 'nota_Descriptiva':
        if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
         }
        else{
          event.preventDefault();
        }           
        break; 
      case 'clave_Edificio':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;      
      case 'clave_TipoSala':
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
  //!!!EXTRAS DE MODIFICACION

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Sala" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-3">
              <label>Nombre</label>
              <InputText type="text" keyfilter={ /^[0-9a-zA-Z]*$/} value={nombre_Sala} maxLength={255}
                  onChange={(event)=>{
                    setnombre_Sala(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>
          <div className="field col-2">
              <label>Capacidad</label>
              <InputText type="text" keyfilter="pint" value={capacidad_Sala} maxLength={10}
                  onChange={(event)=>{
                    setcapacidad_Sala(event.target.value);
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
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>                                                                      
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Sala" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrosala.length ? filtrosala :salaList} size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }}/>;
          })}
        </DataTable>
      </Panel>            
    </>
  )
}

export default Sala