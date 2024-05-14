import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import EdificioService from '../services/EdificioService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';
import UnidadAcademicaService from '../services/UnidadAcademicaService';

const Edificio = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_Edificio, setclave_Edificio] = useState("");
  const [nombre_Edificio,setnombre_Edificio] = useState("");
  const [clave_UnidadAcademica, setclave_UnidadAcademica] = useState(null);
  const [clave_ProgramaEducativo, setclave_ProgramaEducativo] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [edificiosList,setedificiosList] = useState([]);
  const [filtroEdificio, setfiltroEdificio] = useState([]);
  const [programasEducativos, setProgramasEducativos] = useState([]);
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
    if (!clave_Edificio || !nombre_Edificio || !clave_UnidadAcademica) {      
      mostrarAdvertencia("Existen campos vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    EdificioService.registrarEdificio({
      clave_Edificio:clave_Edificio,
      nombre_Edificio:nombre_Edificio,
      clave_UnidadAcademica:clave_UnidadAcademica,
      clave_ProgramaEducativo:clave_ProgramaEducativo     
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {        
        mostrarAdvertencia("Clave ya Existente");
      }else if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya Existente");        
      }else if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }     
    });
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    EdificioService.consultarEdificio().then((response)=>{//CASO EXITOSO
      setedificiosList(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    EdificioService.modificarEdificio(rowData).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación Exitosa");        
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("El Nombre ya se encuentra Registrado");
        get();
      }else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_Edificio("");
    setnombre_Edificio("");    
    setclave_ProgramaEducativo(null);
  } 

  //!!!EXTRAS DE CONSULTA
  
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_Edificio', header: 'Clave' },
    {field: 'nombre_Edificio', header: 'Nombre' },
    {field: 'clave_ProgramaEducativo', header: 'Programa Educativo' },
    {field: 'clave_UnidadAcademica', header: 'Unidad Académica' }      
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  },[]);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = edificiosList.filter((item) => {
    const programaEducativo = item.clave_ProgramaEducativo ? item.clave_ProgramaEducativo.toString() : '';
    const unidadAcademica = item.clave_UnidadAcademica ? item.clave_UnidadAcademica.toString() : '';
    const nombreProgramaEducativo = programasEducativos.find(prog => prog.clave_ProgramaEducativo === item.clave_ProgramaEducativo)?.nombre_ProgramaEducativo || '';
    const nombre_UnidadAcademica = unidadesAcademicas.find(prog => prog.clave_UnidadAcademica === item.clave_UnidadAcademica)?.nombre_UnidadAcademica || '';
        return (
            item.clave_Edificio.toString().includes(value) ||
            item.nombre_Edificio.toLowerCase().includes(value) ||
            programaEducativo.toString().includes(value) ||
            unidadAcademica.toString().includes(value) ||
            nombreProgramaEducativo.toLowerCase().includes(value) ||
            nombre_UnidadAcademica.toLowerCase().includes(value)
        );
    });
    setfiltroEdificio(filteredData);
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
  
  //MANDAR A LLAMAR A LA LISTA DE PROGRAMAS EDUCATIVOS
  useEffect(() => {
    ProgramaEducativoService.consultarProgramaEducativo()
      .then(response => {
        setProgramasEducativos(response.data);
      })
      .catch(error => {
        console.error("Error fetching programas educativos:", error);
      });
  }, []);
  
  //ACTUALIZAR LA UNIDAD ACADEMICA AL CAMBIAR EL PROGRAMA EDUCATIVO SELECCIONADO (INNECESARIO POR AHORA)
  useEffect(() => {
    if (clave_ProgramaEducativo) {
      const programaSeleccionado = programasEducativos.find(prog => prog.clave_ProgramaEducativo === clave_ProgramaEducativo);      
      if (programaSeleccionado) {
        setclave_UnidadAcademica(null);
        setclave_UnidadAcademica(programaSeleccionado.clave_UnidadAcademica);
      }
    }
  }, [clave_ProgramaEducativo, programasEducativos]);

  //BORRAR EL PROGRAMA EDUCATIVO CUANDO SE ELIGE UNA UNIDAD ACADEMICA QUE NO COINCIDE CON EL PROGRAMA EDUCATIVO ACTUAL
  /*useEffect(() => {
    if (clave_UnidadAcademica) {
      if(clave_ProgramaEducativo!==null){                    
        const programaSeleccionado = programasEducativos.find(prog => prog.clave_ProgramaEducativo === clave_ProgramaEducativo);
        if(programaSeleccionado.clave_UnidadAcademica !== clave_UnidadAcademica){
          setclave_ProgramaEducativo(null);
          console.error("holla");
        }
      }
    }
  }, [unidadesAcademicas,clave_UnidadAcademica]);*/
  
  //FUNCION PARA QUE SE MUESTRE LA INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_UnidadAcademica') {
      const unidad = unidadesAcademicas.find((unidad) => unidad.clave_UnidadAcademica === rowData.clave_UnidadAcademica);
      return unidad ? `${unidad.clave_UnidadAcademica} - ${unidad.nombre_UnidadAcademica}` : '';
    } else if (field === 'clave_ProgramaEducativo') {
      const programa = programasEducativos.find((programa) => programa.clave_ProgramaEducativo === rowData.clave_ProgramaEducativo);
      return programa ? `${programa.clave_ProgramaEducativo} - ${programa.nombre_ProgramaEducativo}` : '';
    } else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch(options.field){
      case 'nombre_Edificio':
        return textEditor(options);        
      case 'clave_ProgramaEducativo':
        return ProgramaEducativoEditor(options);
      case 'clave_UnidadAcademica':
        return UnidadAcademicaEditor(options);
      default:
        return textEditor(options);
    }    
  };

  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={options.value} maxLength={255} 
    onChange={(e) => { 
      if (validarTexto(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
  const ProgramaEducativoEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={programasEducativos}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_ProgramaEducativo} - ${option.nombre_ProgramaEducativo}`}
            optionValue="clave_ProgramaEducativo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Programa Educativo" 
            showClear 
        />
    );
  };

  //EDITAR DROPDOWN (UNIDAD ACADEMICA)
  const UnidadAcademicaEditor = (options) => {
    return (
        <Dropdown
          value={options.value}
          options={unidadesAcademicas}
          onChange={(e) => options.editorCallback(e.value)}            
          optionLabel = {(option) => `${option.clave_UnidadAcademica} - ${option.nombre_UnidadAcademica}`}
          optionValue="clave_UnidadAcademica" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
          placeholder="Seleccione una Unidad Académica"
          showClear
        />
    );
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {            
      let { rowData, newValue, field, originalEvent: event } = e;                          
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO        
        case 'nombre_Edificio':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'clave_ProgramaEducativo':
          if (newValue !== rowData[field]){             
            rowData[field] = newValue;
            put(rowData);                       
          }else{
            event.preventDefault();
          } 
          break;
        case 'clave_UnidadAcademica':
          if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
            rowData[field] = newValue;
            put(rowData);              
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
      <Panel header="Registrar Edificio" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave*</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={clave_Edificio} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setclave_Edificio(event.target.value);
                    }
                  }} 
                  placeholder="Ej.6" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre*</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={nombre_Edificio} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setnombre_Edificio(event.target.value);
                    }
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
              showClear
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
              showClear 
            />
          </div>                                                                           
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Edificios" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroEdificio.length ? filtroEdificio :edificiosList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'clave_Edificio' ? null : (options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              body={(rowData) => renderBody(rowData, field)} // Llama a la función renderBody para generar el cuerpo de la columna
              onCellEditInit={(e) => seteditando(true)}/>;
          })}
        </DataTable>          
      </Panel>     
    </>
  )
}

export default Edificio