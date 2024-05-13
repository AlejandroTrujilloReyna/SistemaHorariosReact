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
import TipoSalaService from '../services/TipoSalaService';
const Sala = () => {
  //VARIABLES PARA EL REGISTRO
  const [nombre_Sala,setnombre_Sala] = useState("");
  const [capacidad_Sala,setcapacidad_Sala] = useState(0);
  const [validar_Traslape,setvalidar_Traslape] = useState(1);
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
    //VALIDACION DE CAMPOS VACIOS
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
    }).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya existente en el edificio");
      }else if(error.response.status === 500){          
        mostrarError("Error interno del servidor");
      }  
    })
  }

  //FUNCION PARA CONSULTA
  const get = ()=>{
    SalaService.consultarSala().then((response)=>{//CASO EXITOSO
      setsalaList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }  

  //FUNCION PARA LA MODIFICACION
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
    setvalidar_Traslape(1);
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
  
  //MANDAR A LLAMAR A LA LISTA DE TIPOS DE SALA
  useEffect(() => {
    TipoSalaService.consultarTipoSala()
    .then(response => {
      settiposalas(response.data);
    })
    .catch(error => {
      console.error("Error fetching tiposala:", error);
    });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE EDIFICIOS
  useEffect(() => {
    EdificiosService.consultarEdificio()
    .then(response => {
      setedificios(response.data);
    })
    .catch(error => {
      console.error("Error fetching edificios:", error);
    });
  }, []);
  
  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_Edificio') {
      const edificio = edificios.find((edificio) => edificio.clave_Edificio === rowData.clave_Edificio);
      return edificio ? `${edificio.nombre_Edificio}` : '';
    }else if (field === 'clave_TipoSala'){
      const tiposala = tiposalas.find((tiposala) => tiposala.clave_TipoSala === rowData.clave_TipoSala);
      return tiposala ? `${tiposala.nombre_TipoSala}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };  

  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch(options.field){
      case 'nombre_Sala':
        return textEditor(options);        
      case 'capacidad_Sala':
        return numberEditor(options);
      case 'validar_Traslape':
        return textEditor(options);
      case 'nota_Descriptiva':
         return textEditor(options);      
      case 'clave_Edificio':
        return EdificioEditor(options);    
      case 'clave_TipoSala':
        return TipoSalaEditor(options);                     
      default:
        return textEditor(options);
    }    
  };

  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText keyfilter={/^[0-9a-zA-Z]*$/} type="text" maxLength={255} value={options.value} 
    onChange={(e) => { 
      if (validarTexto(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="pint"  type="text" maxLength={11} value={options.value} 
    onChange={(e) => { 
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR DROPDOWN (EDIFICIO)
  const EdificioEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={edificios}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_Edificio} - ${option.nombre_Edificio}`}
            optionValue="clave_Edificio" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Edificio" 
        />
    );
  };

  //EDITAR DROPDOWN (TIPOSALA)
  const TipoSalaEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={tiposalas}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_TipoSala} - ${option.nombre_TipoSala}`}
            optionValue="clave_TipoSala"
            placeholder="Seleccione un tipo de Sala" 
        />
    );
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'nombre_Sala':
        if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }else{
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
        if (newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }else{
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
  
  //!!!EXTRAS CAMPOS

  const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return regex.test(value);
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
                    if (validarNumero(event.target.value)) {
                      setcapacidad_Sala(event.target.value);
                    }
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
        <DataTable value={filtrosala.length ? filtrosala :salaList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_Sala' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>            
    </>
  )
}

export default Sala