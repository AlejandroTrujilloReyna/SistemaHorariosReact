import React, { Fragment } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { mostrarExito, mostrarAdvertencia, mostrarError } from '../services/ToastService';
import HorarioService from '../services/HorarioService';
import DiaService from '../services/DiaService';
import SalaService from '../services/SalaService';
import GrupoService from '../services/GrupoService';
import DocenteService from '../services/DocenteService';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';
import TipoSubGrupoService from '../services/TipoSubGrupoService';
import { validarNumero} from '../services/ValidacionGlobalService';
import { InputNumber } from 'primereact/inputnumber';

const HorarioNdos = () => {
  //VARIABLES PARA EL REGISTRO  
  let intercambioedit = 0;
  let horario = {
    hora_Entradain:"",
    hora_Salidain:"",
    salain:null
  };
  const [clave_Grupo,setclave_Grupo] = useState(null);
  const [clave_UnidadAprendizaje,setclave_UnidadAprendizaje] = useState(null);
  const [no_Empleado_Docente,setno_Empleado_Docente] = useState(null);
  const [clave_TipoSubGrupo,setclave_TipoSubGrupo] = useState(null);
  const [hora_Entrada,sethora_Entrada] = useState('');
  const [hora_Salida,sethora_Salida] = useState('');
  const [clave_Dia,setclave_Dia] = useState(null);
  const [clave_SubGrupo,setclave_SubGrupo] = useState(null);
  const [clave_Sala,setclave_Sala] = useState(null);
  const [capacidad_SubGrupo,setcapacidad_SubGrupo] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [horariolist,sethorariolist] = useState([]);
  const [filtrohorario,setfiltrohorario] = useState([]);
  const [dias, setDias] = useState([]);
  const [subgrupos, setSubgrupos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [gruposList, setGrupoList] = useState([]);
  const [docenteList, setdocenteList] = useState([]);
  const [unidadesAprendizajeList, setunidadesAprendizajeList] = useState([]);
  const [tipoSubGrupoList, settipoSubGrupoList] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);  
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);

  //FUNCION PARA REGISTRAR
  const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_Grupo || !clave_UnidadAprendizaje  || !no_Empleado_Docente || !clave_TipoSubGrupo || !capacidad_SubGrupo || !hora_Entrada || !hora_Salida || !clave_Dia || !clave_Sala) {
      mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    HorarioService.registrarHorarioYSubGrupo({
        clave_Grupo: 1,
        clave_UnidadAprendizaje: clave_UnidadAprendizaje,
        no_Empleado_Docente: no_Empleado_Docente,
        clave_TipoSubGrupo: clave_TipoSubGrupo,
        capacidad_SubGrupo: capacidad_SubGrupo,
        hora_Entrada:hora_Entrada,
        hora_Salida:hora_Salida,
        clave_Dia:clave_Dia,        
        clave_Sala:clave_Sala      
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito(toast,"Registro exitoso");
        get();
        //limpiarCampos();
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
  
  const addCompleto = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_Grupo || !clave_UnidadAprendizaje  || !no_Empleado_Docente || !clave_TipoSubGrupo || !capacidad_SubGrupo || !hora_Entrada || !hora_Salida || !clave_Dia || !clave_Sala) {
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
        get();
        //limpiarCampos();
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

  //FUNCION PARA CONSULTA
  const get = ()=>{
    HorarioService.consultaCompletaHorario().then((response)=>{//CASO EXITOSO
      sethorariolist(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }
  
  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    HorarioService.modificarHorario(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito(toast,"Modificación Exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia(toast,"La hora de Salida debe ser posterior a la hora de Entrada");
        get();
      } else if (error.response.status === 402) {
        mostrarAdvertencia(toast,"Ya existe un Registro en ese Horario");
        get();      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }
    })
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

    //COLUMNAS PARA LA TABLA
    const columns = [
      {field: 'clave_SubGrupo', header: 'Clave SubGrupo', hidden: true, exportable: true },
      {field: 'clave_Horario', header: 'Clave Horario', hidden: true, exportable: true },
      {field: 'clave_UnidadAprendizaje', header: 'Clave Unidad Aprendizaje', hidden: true, exportable: true },
      {field: 'unidadAprendizaje', header: 'Unidad Aprendizaje' },
      {field: 'no_Empleado_Docente', header: 'NoEmpleado Docente', hidden: true, exportable: true },  
      {field: 'docente', header: 'Docente' }, 
      {field: 'clave_TipoSubGrupo', header: 'Tipo de SubGrupo' },
      {field: 'capacidad_SubGrupo', header: 'Capacidad' },
      {field: 'hora_Entrada', header: 'Entrada' },
      {field: 'hora_Salida', header: 'Salida'},
      {field: 'clave_Dia', header: 'Día'},    
      {field: 'clave_Sala', header: 'Sala'},
      {field: '1', header: 'Lunes'},
      {field: '2', header: 'Martes'},
      {field: '3', header: 'Miercoles'},
      {field: '4', header: 'Jueves'},
      {field: '5', header: 'Viernes'},
      {field: '6', header: 'Sabado'}    
    ];  

  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = horariolist.filter((item) => {
        return (
            item.clave_Horario.toString().includes(value)||
            item.hora_Entrada.toString().includes(value) ||
            item.hora_Salida.toString().includes(value) ||
            item.clave_Dia.toString().includes(value)||
            item.clave_SubGrupo.toString().includes(value)||
            item.clave_Sala.toString().includes(value)           
        );
    });
    setfiltrohorario(filteredData);
  };     
  
  //MANDAR A LLAMAR A LA LISTA DE DIAS
  useEffect(() => {
    DiaService.consultarDia()
      .then(response => {
        setDias(response.data);
      })
      .catch(error => {
        console.error("Error fetching dia:", error);
      });
    GrupoService.consultarGrupo()
      .then(response => {
        setGrupoList(response.data);
      })
      .catch(error => {
        console.error("Error fetching dia:", error);
      });
    DocenteService.consultarDocente()
      .then(response => {
        setdocenteList(response.data);
      })
      .catch(error => {
        console.error("Error fetching dia:", error);
      });
    UnidadAprendizajeService.consultarUnidadAprendizaje()
      .then(response => {
        setunidadesAprendizajeList(response.data);
      })
      .catch(error => {
        console.error("Error fetching dia:", error);
      });
    TipoSubGrupoService.consultarTipoSubGrupo()
      .then(response => {
        settipoSubGrupoList(response.data);
      })
      .catch(error => {
        console.error("Error fetching dia:", error);
      });
  }, []);
/*
  function sumarUnaHora(hora) {
    const [horas, minutos] = hora.split(":").map(Number);
    let nuevasHoras = horas + 1;
  
    // Ajustar las horas y los períodos (AM/PM) si es necesario
    if (nuevasHoras === 24) {
      nuevasHoras = 0;
    } else if (nuevasHoras > 12) {
      nuevasHoras -= 12;
    }
  
    return `${String(nuevasHoras).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }
  
  function restarUnaHora(hora) {
    const [horas, minutos] = hora.split(":").map(Number);
    let nuevasHoras = horas - 1;
  
    // Ajustar las horas y los períodos (AM/PM) si es necesario
    if (nuevasHoras === -1) {
      nuevasHoras = 23;
    } else if (nuevasHoras < 0) {
      nuevasHoras += 12;
    }
  
    return `${String(nuevasHoras).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }
  
  
  useEffect(() => {
    const entradaDate = new Date(`1970-01-01T${hora_Entrada}:00`);
    const salidaDate = new Date(`1970-01-01T${hora_Salida}:00`);
  
    if (entradaDate >= salidaDate) {
      sethora_Salida(sumarUnaHora(hora_Salida));
    }
  }, [hora_Entrada]);
  
  useEffect(() => {
    const entradaDate = new Date(`1970-01-01T${hora_Entrada}:00`);
    const salidaDate = new Date(`1970-01-01T${hora_Salida}:00`);
  
    if (entradaDate >= salidaDate) {
      sethora_Entrada(restarUnaHora(hora_Entrada));
    }
  }, [hora_Salida]);*/
  


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
  
  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_Dia') {
      const dia = dias.find((dia) => dia.clave_Dia === rowData.clave_Dia);
      return dia ? `${dia.nombre_Dia}` : '';
    }else if (field === 'clave_Sala') {
      const sala = salas.find((sala) => sala.clave_Sala === rowData.clave_Sala);
      return sala ? `${sala.nombre_Sala}` : '';
    }else {
      return rowData[field];
    }
  };

  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
const cellEditor = (options) => {
  switch (options.field) {
    case 'hora_Entrada':
      horario.hora_Entradain = options;
      return timeEditor(options);
    case 'hora_Salida':
      horario.hora_Salidain = options;
      return timeEditor(options);
    case 'clave_Dia':
      horario.salain = options;
      return DiaEditor(options);
    case 'clave_SubGrupo':
      return SubgrupoEditor(options);
    case 'clave_Sala':
      return SalaEditor(options); 
    case 'clave_UnidadAprendizaje':
      intercambioedit = options;
      return UnidadAprendizajeEditor(options); 
    case 'unidadAprendizaje':
      return UnidadAprendizajeEditor(intercambioedit); 
    case 'no_Empleado_Docente':
      intercambioedit = options;
      return DocenteEditor(options); 
    case 'docente':
      return DocenteEditor(intercambioedit); 
    case 'clave_TipoSubGrupo':
      return TipoSubGurpoEditor(options);
    case 'capacidad_SubGrupo':
      return CapacidadEditor(options);         
    case '1':
      return horarioEditor(options);
    default:
      return 0;
  }
};
/*
  
  const horarioEditor = (options) => {
    return (
    <React.Fragment>
      <InputText type="time" value={hora_Entrada} maxLength={10}
        onChange={(e) => options.hora_Entradain.editorCallback(e.value)}
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>          
      <InputText type="time" value={hora_Salida} maxLength={10}
        onChange={(e) => options.hora_Salidain.editorCallback(e.value)}
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>          
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={clave_Sala} 
        options={salas} 
        onChange={(e) => options.salain.editorCallback(e.value)}
        optionLabel = {(option) => `${option.clave_Sala} - ${option.nombre_Sala}`} 
        optionValue="clave_Sala" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
        placeholder="Seleccione una Salas" 
      />
    </React.Fragment>)
  };
*/

  const horarioEditor = (options) => {
    return (
      <React.Fragment>        
        <InputText type="time" value={hora_Entrada} maxLength={10}
          onChange={(event)=>{
            sethora_Entrada(event.target.value);
          }}  
          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>          
        <InputText type="time" value={hora_Salida} maxLength={10}
          onChange={(event)=>{
            sethora_Salida(event.target.value);
          }}  
          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>                  
        <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
          value={clave_Sala} 
          options={salas} 
          onChange={(e) => {
            setclave_Sala(e.value);
          }} 
          optionLabel="nombre_Sala" 
          optionValue="clave_Sala" 
          placeholder="Seleccione una Salas" 
        />
      </React.Fragment>
    )
  };

  //EDITAR DROPDOWN (DIA)
  const CapacidadEditor = (options) => {
    return (
      
      <InputNumber value={options.value} 
      onChange={(e) => options.editorCallback(e.value)}
      mode="decimal" showButtons min={0} max={200} 
      placeholder="Selecciona una Unidad Aprendizaje" />
    );
  };
  
  //EDITAR DROPDOWN (DIA)
  const UnidadAprendizajeEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={unidadesAprendizajeList}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel = {(option) => `${option.clave_UnidadAprendizaje} - ${option.nombre_UnidadAprendizaje}`}
        optionValue="clave_UnidadAprendizaje"
        placeholder="Selecciona una Unidad Aprendizaje" 
      />
    );
  };

  //EDITAR DROPDOWN (DIA)
  const DocenteEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={docenteList}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel = {(option) => `${option.no_EmpleadoDocente}`}
        optionValue="no_EmpleadoDocente"
        placeholder="Selecciona un Docente" 
      />
    );
  };

  //EDITAR DROPDOWN (DIA)
  const TipoSubGurpoEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={tipoSubGrupoList}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel = "nombre_TipoSubGrupo"
        optionValue="clave_TipoSubGrupo"
        placeholder="Selecciona un Tipo de Clase" 
      />
    );
  };

  // EDITOR DE TIEMPO
  const timeEditor = (options) => {
    return <InputText type="time" value={options.value} 
    onChange={(e) =>{ 
        options.editorCallback(e.target.value)
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };
  
  //EDITAR DROPDOWN (DIA)
  const DiaEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={dias}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_Dia" 
                optionValue="clave_Dia"
                placeholder="Selecciona un Día" 
      />
    );
  };
  
  //EDITAR DROPDOWN (SUBGRUPO)
  const SubgrupoEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={subgrupos}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="no_SubGrupo" 
                optionValue="clave_SubGrupo"
                placeholder="Selecciona un Subgrupo" 
      />
    );
  };
  
  //EDITAR DROPDOWN (SALA)
  const SalaEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={salas}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel="nombre_Sala" 
        optionValue="clave_Sala"
        placeholder="Selecciona una Sala" 
      />
    );
  };
   
  const allowEdit = (rowData) => {
    return rowData;
  };

  const onRowEditComplete = (e) => {
    let updatedHorarios = [...horariolist]; // Crear una copia del estado actual de los horarios
    let { newData, index } = e; // Obtener los datos editados y el índice de la fila editada
  
    updatedHorarios[index] = newData; // Actualizar los datos en la copia de los horarios
  
    sethorariolist(updatedHorarios); // Actualizar el estado de los horarios con los datos editados
  };
    
  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      <Panel header="Registrar Horario" className='mt-3' toggleable>
          <div className="formgrid grid mx-8 justify-content-center">
            <div className="field col-5">
              <label>Grupo*</label>
              <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
                value={clave_Grupo} 
                options={gruposList} 
                onChange={(e) => {
                  setclave_Grupo(e.value);
                }} 
                
                optionLabel = "nombre_Grupo"
                optionValue="clave_Grupo" // Aquí especificamos que la clave del grupo se utilice como el valor de la opción seleccionada
                placeholder="Seleccione un Grupo"               
              />
            </div>
            <div className="field col-3">
              <label>Unidad de Aprendizaje Impartida*</label>
              <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
                value={clave_UnidadAprendizaje} 
                options={unidadesAprendizajeList} 
                onChange={(e) => {
                  setclave_UnidadAprendizaje(e.value);
                }} 
                
                optionLabel = {(option) => `${option.clave_UnidadAprendizaje} - ${option.nombre_UnidadAprendizaje}`}
                optionValue="clave_UnidadAprendizaje" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione la Unidad de Aprendizaje"               
              />
            </div>
            <div className="field col-3">
              <label>Docente Asignado*</label>
              <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
                value={no_Empleado_Docente} 
                options={docenteList} 
                onChange={(e) => {
                  setno_Empleado_Docente(e.value);
                }} 
                
                optionLabel = "no_EmpleadoDocente"
                optionValue="no_EmpleadoDocente" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione El docente a impartir"               
              />
            </div>
            <div className="field col-3">
              <label>Tipo de SubGrupo*</label>
              <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
                value={clave_TipoSubGrupo} 
                options={tipoSubGrupoList} 
                onChange={(e) => {
                  setclave_TipoSubGrupo(e.value);
                }} 
              
                optionLabel = "nombre_TipoSubGrupo"
                optionValue="clave_TipoSubGrupo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione un Tipo de SubGrupo"               
              />
            </div>
            <div className="field col">
            <label className="font-bold">
              Capacidad*
            </label>
            <InputText              
              type="text" 
              keyfilter={/^[0-9]*$/}
              value={capacidad_SubGrupo}              
              onChange={(event)=>{
                if (validarNumero(event.target.value)) {
                  setcapacidad_SubGrupo(event.target.value);
                }
              }}               
              required            
              maxLength={10}
              placeholder="Ej.25"              
            />                    
          </div>
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
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Horarios" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>
      <DataTable value={filtrohorario.length ? filtrohorario :horariolist} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} size='small' tableStyle={{ minWidth: '50rem' }}>
          <Column
            rowEditor={allowEdit}
            headerStyle={{ width: '10%', minWidth: '8rem' }}
            bodyStyle={{ textAlign: 'center' }}
          ></Column>
          {columns.map(({ field, hidden, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={hidden ? { display: 'none' } : { minWidth: '40vh' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_Horario' ? null : (options) => cellEditor(options)}/>;
          })}
      </DataTable>                
      </Panel>        
    </>
  )
}

export default HorarioNdos