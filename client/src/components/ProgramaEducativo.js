import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import ProgramaEducativoService from '../services/ProgramaEducativoService';
import UnidadAcademicaService from '../services/UnidadAcademicaService';

const ProgramaEducativo = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_ProgramaEducativo,setclave_ProgramaEducativo] = useState(0);
  const [nombre_ProgramaEducativo,setnombre_ProgramaEducativo] = useState("");
  const [banco_Horas,setbanco_Horas] = useState(0);
  const [min_Grupo,setmin_Grupo] = useState(0);
  const [max_Grupo,setmax_Grupo] = useState(0);
  const [clave_UnidadAcademica,setclave_UnidadAcademica] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [programaeducativoList,setprogramaeducativoList] = useState([]);
  const [filtroprogramaeducativo, setfiltroprogramaeducativo] = useState([]);
  const [unidadesAcademicas, setUnidadesAcademicas] = useState([]);
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
    if (!clave_UnidadAcademica || !clave_ProgramaEducativo || !nombre_ProgramaEducativo || !min_Grupo || !max_Grupo) {
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    ProgramaEducativoService.registrarProgramaEducativo({
      clave_ProgramaEducativo:clave_ProgramaEducativo,
      nombre_ProgramaEducativo:nombre_ProgramaEducativo,
      //VALIDACION PARA EL CAMPO NUMERICO NO OBLIGATORIO BANCO DE HORAS
      banco_Horas:banco_Horas.trim() !== '' ? banco_Horas : 0,
      min_Grupo:min_Grupo,
      max_Grupo:max_Grupo,
      clave_UnidadAcademica:clave_UnidadAcademica      
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito("Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya existente");
      } else if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya existente");      
      }else if(error.response.status === 500){          
        mostrarError("Error interno del servidor");
      }     
    });
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    ProgramaEducativoService.consultarProgramaEducativo().then((response)=>{//CASO EXITOSO
      setprogramaeducativoList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    ProgramaEducativoService.modificarProgramaEducativo(rowData).then(response=>{//CASO EXITOSO
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
    setclave_ProgramaEducativo(0);
    setnombre_ProgramaEducativo("");
    setbanco_Horas(0);
    setmin_Grupo(0);
    setmax_Grupo(0);
    setclave_UnidadAcademica(0);
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_ProgramaEducativo', header: 'Clave' },
    {field: 'nombre_ProgramaEducativo', header: 'Nombre' },
    {field: 'min_Grupo', header: 'Capacidad minima'},
    {field: 'max_Grupo', header: 'Capacidad maxima'},
    {field: 'banco_Horas', header: 'Banco de Horas'},
    {field: 'clave_UnidadAcademica', header: 'Unidad Academica'}    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //ORDENAR LOS DATOS POR LA CLAVE AL INGRESAR A LA PAGINA
  useEffect(() => {
    setfiltroprogramaeducativo([...programaeducativoList].sort((a, b) => a.clave_ProgramaEducativo - b.clave_ProgramaEducativo));
  }, [programaeducativoList]);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = programaeducativoList.filter((item) => {
        return (
            item.clave_UnidadAcademica.toString().includes(value) ||
            item.clave_ProgramaEducativo.toString().includes(value) ||
            item.nombre_ProgramaEducativo.toLowerCase().includes(value) ||
            item.min_Grupo.toString().includes(value) ||
            item.max_Grupo.toString().includes(value) ||
            item.banco_Horas.toString().includes(value)            
        );
    });
    setfiltroprogramaeducativo(filteredData);
  }; 

  //MANDAR A LLAMAR A LA LISTA DE UNIDADES ACADEMICAS
  useEffect(() => {
    UnidadAcademicaService.consultarUnidadAcademica()
      .then(response => {
        setUnidadesAcademicas(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_UnidadAcademica') {
      const unidad = unidadesAcademicas.find((unidad) => unidad.clave_UnidadAcademica === rowData.clave_UnidadAcademica);
      return unidad ? `${unidad.nombre_UnidadAcademica}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch (options.field) {
      case 'nombre_ProgramaEducativo':
        return textEditor(options);
      case 'min_Grupo':
        return numberEditor(options);
      case 'max_Grupo':
        return numberEditor(options);
      case 'banco_Horas':
        return numberEditor(options);
      case 'clave_UnidadAcademica':
        return UnidadAcademicaEditor(options);
      default:
        return textEditor(options);  
    }
  };

  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText keyfilter={/[a-zA-Z\s]/} maxLength={255} type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
  };
  

  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="pint"  type="text" maxLength={6} value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR DROPDOWN (UNIDAD ACADEMICA)
  const UnidadAcademicaEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={unidadesAcademicas}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_UnidadAcademica" 
                optionValue="clave_UnidadAcademica" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Selecciona una Unidad Academica" 
      />
    );
  };    

  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
      let { rowData, newValue, field, originalEvent: event } = e;
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
        case 'nombre_ProgramaEducativo':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
            rowData[field] = newValue; put(rowData);
          }
          else{
            event.preventDefault();
          } 
          break;
        case 'min_Grupo':
          if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
            rowData[field] = newValue; put(rowData);
          }else{
            event.preventDefault();
          }
          break;
        case 'max_Grupo':
          if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
            rowData[field] = newValue; put(rowData);
          }else{
            event.preventDefault();
          }
          break;
        case 'banco_Horas':
          if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
            rowData[field] = newValue; put(rowData);
          }else{
            event.preventDefault();
          }
          break;
        case 'clave_UnidadAcademica':
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

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Programa Educativo" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_ProgramaEducativo} maxLength={10}
                  onChange={(event)=>{
                    setclave_ProgramaEducativo(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_ProgramaEducativo} maxLength={255}
                  onChange={(event)=>{
                    setnombre_ProgramaEducativo(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>
          <div className="field col-2">
              <label>Banco de horas</label>
              <InputText type="text" keyfilter="pint" value={banco_Horas} maxLength={10}
                  onChange={(event)=>{
                    setbanco_Horas(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Capacidad Minima</label>
              <InputText type="text" keyfilter="pint" value={min_Grupo} maxLength={10}
                  onChange={(event)=>{
                    setmin_Grupo(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Capacidad Maxima</label>
              <InputText type="text" keyfilter="pint" value={max_Grupo} maxLength={10}
                  onChange={(event)=>{
                    setmax_Grupo(event.target.value);
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
      </Panel>    
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Programa Educativo" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtroprogramaeducativo.length ? filtroprogramaeducativo :programaeducativoList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_ProgramaEducativo' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>  
    </>
  )
}

export default ProgramaEducativo