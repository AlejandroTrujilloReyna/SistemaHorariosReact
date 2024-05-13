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
import DocenteService from '../services/DocenteService';
import GradoEstudioService from '../services/GradoEstudioService';
import TipoEmpleadoService from '../services/TipoEmpleadoService';
import UsuarioService from '../services/UsuarioService';

const Docente = () => {
  //VARIABLES PARA EL REGISTRO
  const [no_EmpleadoDocente, setno_EmpleadoDocente] = useState("");
  const [horas_MinimasDocente,sethoras_MinimasDocente] = useState("");
  const [horas_MaximasDocente,sethoras_MaximasDocente] = useState("");
  const [horas_Externas,sethoras_Externas] = useState("");
  const [clave_TipoEmpleado,setclave_TipoEmpleado] = useState(null);
  const [clave_GradoEstudio, setclave_GradoEstudio] = useState(null);
  const [clave_Usuario, setclave_Usuario] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [docentesList,setdocentesList] = useState([]);
  const [filtroDocente, setfiltroDocente] = useState([]);
  const [gradosEstudio, setGradosEstudio] = useState([]);
  const [tiposEmpleados, setTiposEmpleados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
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
    if (!no_EmpleadoDocente || !horas_MinimasDocente || !horas_MaximasDocente || !horas_Externas || !clave_TipoEmpleado || !clave_GradoEstudio || !clave_Usuario) {      
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    DocenteService.registrarDocente({
      no_EmpleadoDocente:no_EmpleadoDocente,
      horas_MinimasDocente:horas_MinimasDocente,
      horas_MaximasDocente:horas_MaximasDocente,
      horas_Externas:horas_Externas,
      clave_TipoEmpleado:clave_TipoEmpleado,
      clave_GradoEstudio:clave_GradoEstudio,
      clave_Usuario:clave_Usuario     
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {        
        mostrarAdvertencia("Clave ya existente");
      }else if(error.response.status === 403){
        mostrarAdvertencia("Favor de Revisar las horas");        
      }else if(error.response.status === 405){
        mostrarAdvertencia("Solo puede haber un usuario por docente");        
      }else if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }     
    });
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    DocenteService.consultarDocente().then((response)=>{//CASO EXITOSO
      setdocentesList(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    DocenteService.modificarDocente(rowData).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación Exitosa");        
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 403) {
        mostrarAdvertencia("Favor de Revisar las horas");
        get();
      }else if(error.response.status === 405){
        mostrarAdvertencia("Solo puede haber un usuario por docente");
        get();        
      }else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setno_EmpleadoDocente("");
    sethoras_MinimasDocente("");    
    sethoras_MaximasDocente("");
    sethoras_Externas("");
    setclave_TipoEmpleado(null);
    setclave_GradoEstudio(null);
    setclave_Usuario(null);
  } 

  //!!!EXTRAS DE CONSULTA
  
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'no_EmpleadoDocente', header: 'NO.Empleado' },
    {field: 'horas_MinimasDocente', header: 'Horas minimas' },
    {field: 'horas_MaximasDocente', header: 'Horas maximas' },
    {field: 'horas_Externas', header: 'Horas Externas' },
    {field: 'clave_TipoEmpleado', header: 'Tipo Empleado' },
    {field: 'clave_GradoEstudio', header: 'Grado Estudio' },
    {field: 'clave_Usuario', header: 'Usuario' }
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  },[]);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = docentesList.filter((item) => {
    const tipoEmpl = item.clave_TipoEmpleado ? item.clave_TipoEmpleado.toString() : '';
    const gradoEst = item.clave_GradoEstudio ? item.clave_GradoEstudio.toString() : '';    
    const nombreTipoEmpl = tiposEmpleados.find(tip => tip.clave_TipoEmpleado === item.clave_TipoEmpleado)?.nombre_TipoEmpleado || '';
    const nombre_GradoEst = gradosEstudio.find(grad => grad.clave_GradoEstudio === item.clave_GradoEstudio)?.nombre_GradoEstudio || '';
    const nombre_Us = usuarios.find(u => u.clave_Usuario === item.clave_Usuario)?.correo || '';
        return (
            item.no_EmpleadoDocente.toString().includes(value) ||
            item.horas_MinimasDocente.toString().includes(value) ||
            item.horas_MaximasDocente.toString().includes(value) ||
            tipoEmpl.toString().includes(value) ||
            gradoEst.toString().includes(value) ||
            nombreTipoEmpl.toLowerCase().includes(value) ||
            nombre_GradoEst.toLowerCase().includes(value) ||
            nombre_Us.toLowerCase().includes(value)
        );
    });
    setfiltroDocente(filteredData);
  };  

  //MANDAR A LLAMAR A LA LISTA DE TIPO EMPLEADO
  useEffect(() => {
    TipoEmpleadoService.consultarTipoEmpleado()
      .then(response => {
        setTiposEmpleados(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos empleado:", error);
      });
  }, []);
  
  //MANDAR A LLAMAR A LA LISTA DE GRADO ESTUDIO
  useEffect(() => {
    GradoEstudioService.consultarGradoEstudio()
      .then(response => {
        setGradosEstudio(response.data);
      })
      .catch(error => {
        console.error("Error fetching grados estudio:", error);
      });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE USUARIOS
  useEffect(() => {
    UsuarioService.consultarUsuario()
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error("Error fetching usuarios:", error);
      });
  }, []);
  
  //ACTUALIZAR LA UNIDAD ACADEMICA AL CAMBIAR EL PROGRAMA EDUCATIVO SELECCIONADO (INNECESARIO POR AHORA)
  /*useEffect(() => {
    if (clave_ProgramaEducativo) {
      const programaSeleccionado = programasEducativos.find(prog => prog.clave_ProgramaEducativo === clave_ProgramaEducativo);      
      if (programaSeleccionado) {
        setclave_UnidadAcademica(null);
        setclave_UnidadAcademica(programaSeleccionado.clave_UnidadAcademica);
      }
    }
  }, [clave_ProgramaEducativo, programasEducativos]);*/

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
    if (field === 'clave_Usuario') {
      const usus = usuarios.find((usus) => usus.clave_Usuario === rowData.clave_Usuario);
      return usus ? `${usus.clave_Usuario} - ${usus.correo}` : '';
    } else if (field === 'clave_TipoEmpleado') {
      const tipo = tiposEmpleados.find((tipo) => tipo.clave_TipoEmpleado === rowData.clave_TipoEmpleado);
      return tipo ? `${tipo.clave_TipoEmpleado} - ${tipo.nombre_TipoEmpleado}` : '';
    } else if (field === 'clave_GradoEstudio') {
        const grado = gradosEstudio.find((grado) => grado.clave_GradoEstudio === rowData.clave_GradoEstudio);
        return grado ? `${grado.clave_GradoEstudio} - ${grado.nombre_GradoEstudio}` : '';
    } else {
      return rowData[field];
    }
  };
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch(options.field){  
      case 'clave_Usuario':
        return UsuarioEditor(options);
      case 'clave_TipoEmpleado':
        return TipoEmpleadoEditor(options);
      case 'clave_GradoEstudio':
        return GradoEstudioEditor(options);
        default:
        return numberEditor(options);
    }    
  };

  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="int"  type="text" maxLength={6} value={options.value} 
    onChange={(e) => {
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }} onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR TEXTO
  /*const textEditor = (options) => {
    return <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={options.value} maxLength={255} 
    onChange={(e) => { 
      if (validarTexto(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };*/

  //EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
  const UsuarioEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={usuarios}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_Usuario} - ${option.correo}`}
            optionValue="clave_Usuario" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Usuario"             
        />
    );
  };

  //EDITAR DROPDOWN (UNIDAD ACADEMICA)
  const TipoEmpleadoEditor = (options) => {
    return (
        <Dropdown
          value={options.value}
          options={tiposEmpleados}
          onChange={(e) => options.editorCallback(e.value)}            
          optionLabel = {(option) => `${option.clave_TipoEmpleado} - ${option.nombre_TipoEmpleado}`}
          optionValue="clave_TipoEmpleado" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
          placeholder="Seleccione un Tipo de Empleado"          
        />
    );
  };

  //EDITAR DROPDOWN (UNIDAD ACADEMICA)
  const GradoEstudioEditor = (options) => {
    return (
        <Dropdown
          value={options.value}
          options={gradosEstudio}
          onChange={(e) => options.editorCallback(e.value)}            
          optionLabel = {(option) => `${option.clave_GradoEstudio} - ${option.nombre_GradoEstudio}`}
          optionValue="clave_GradoEstudio" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
          placeholder="Seleccione un Grado de Estudio"          
        />
    );
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {            
      let { rowData, newValue, field, originalEvent: event } = e;                          
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO        
        case 'horas_MinimasDocente':
          if (newValue > 0 && newValue !== null && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'horas_MaximasDocente':
          if (newValue > 0 && newValue !== null && newValue !== rowData[field]){             
            rowData[field] = newValue;
            put(rowData);                       
          }else{
            event.preventDefault();
          } 
          break;
        case 'horas_Externas':
          if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
            rowData[field] = newValue;
            put(rowData);              
          }else{
            event.preventDefault();
          } 
          break;
        case 'clave_TipoEmpleado':
            if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
              rowData[field] = newValue;
              put(rowData);              
            }else{
              event.preventDefault();
            } 
            break;        
        case 'clave_GradoEstudio':
            if (newValue > 0 && newValue !== null && newValue !== rowData[field]){ 
              rowData[field] = newValue;
              put(rowData);              
            }else{
              event.preventDefault();
            } 
            break;
        case 'clave_Usuario':
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

  /*const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return regex.test(value);
  };*/

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
      <Panel header="Registrar Docente" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-2">
              <label>No.Empleado</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={no_EmpleadoDocente} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setno_EmpleadoDocente(event.target.value);
                    }
                  }} 
                  placeholder="Ej.12345678" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-5">
            <label>Usuario</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_Usuario} 
              options={usuarios} 
              onChange={(e) => {
                setclave_Usuario(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel = {(option) => `${option.correo} - ${option.nombre_Usuario} ${option.apellidoP_Usuario} ${option.apellidoM_Usuario}`}
              optionValue="clave_Usuario" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Usuario"               
            />
          </div>
          <div className="field col-3">
            <label>Tipo Empleado</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_TipoEmpleado} 
              options={tiposEmpleados} 
              onChange={(e) => {
                setclave_TipoEmpleado(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel = {(option) => `${option.clave_TipoEmpleado} - ${option.nombre_TipoEmpleado}`}
              optionValue="clave_TipoEmpleado" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione Tipo de Empleado"               
            />
          </div>
          <div className="field col-3">
            <label>Grado de Estudio</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_GradoEstudio} 
              options={gradosEstudio} 
              onChange={(e) => {
                setclave_GradoEstudio(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel = {(option) => `${option.clave_GradoEstudio} - ${option.nombre_GradoEstudio}`}
              optionValue="clave_GradoEstudio" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione Grado de Estudio"               
            />
          </div>
          <div className="field col-2">
              <label>Horas Minimas</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={horas_MinimasDocente} maxLength={2}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_MinimasDocente(event.target.value);
                    }
                  }} 
                  placeholder="Ej.14" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Horas Maximas</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={horas_MaximasDocente} maxLength={2}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_MaximasDocente(event.target.value);
                    }
                  }} 
                  placeholder="Ej.40" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>   
          <div className="field col-2">
              <label>Horas Externas</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={horas_Externas} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_Externas(event.target.value);
                    }
                  }} 
                  placeholder="Ej.5" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>                                                                       
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Edificio" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroDocente.length ? filtroDocente :docentesList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '5%' }} editor={field === 'no_EmpleadoDocente' ? null : (options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              body={(rowData) => renderBody(rowData, field)} // Llama a la función renderBody para generar el cuerpo de la columna
              />;
          })}
        </DataTable>          
      </Panel>     
    </>
  )
}

export default Docente