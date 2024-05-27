import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { Toast } from 'primereact/toast';
import DocenteService from '../services/DocenteService';
import GradoEstudioService from '../services/GradoEstudioService';
import TipoEmpleadoService from '../services/TipoEmpleadoService';
import UsuarioService from '../services/UsuarioService';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';
import ImpartirUnidadAprendizajeService from '../services/ImpartirUnidadAprendizajeService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

const DocenteN = () => {
  //VARIABLES ESTADO PARA LOS DIALOG, ACCIONES Y FILTRO TABLA
    const [mostrarDialog, setMostrarDialog] = useState(false);
    const [mostrarEliminarDialog, setMostrarEliminarDialog] = useState(false);
    const [frmEnviado, setFrmEnviado] = useState(false);
    const [accionesFrozen, setAccionesFrozen] = useState(false);    
    const [lazyState, setlazyState] = useState({
      filters: {
        no_EmpleadoDocente: { value: '', matchMode: 'startsWith' },
        horas_MinimasDocente: { value: '', matchMode: 'equals' },
        horas_MaximasDocente: { value: '', matchMode: 'equals' },
        horas_Externas: { value: '', matchMode: 'equals' },
        clave_TipoEmpleado: { value: '', matchMode: 'startsWith' },
        clave_GradoEstudio: { value: '', matchMode: 'startsWith' },
        clave_Usuario: { value: '', matchMode: 'startsWith' },
        unidadesAprendizaje: { value: '', matchMode: 'contains' }
      },
    });  
  //VARIABLES PARA EL REGISTRO
  const [no_EmpleadoDocente, setno_EmpleadoDocente] = useState("");
  const [horas_MinimasDocente,sethoras_MinimasDocente] = useState("");
  const [horas_MaximasDocente,sethoras_MaximasDocente] = useState("");
  const [horas_Externas,sethoras_Externas] = useState("");
  const [clave_TipoEmpleado,setclave_TipoEmpleado] = useState(null);
  const [clave_GradoEstudio, setclave_GradoEstudio] = useState(null);
  const [clave_Usuario, setclave_Usuario] = useState(null);
  const [unidadesseleccionadas,setunidadesseleccionadas] = useState([]);
  const [programaseducativosseleccionados,setprogramaseducativosseleccionados] = useState([]);
  const [horasprogramaseducativos,sethorasprogramaseducativos] = useState([]);
  const [programaeducativohoras, setprogramaeducativohoras] = useState({});
  //VARIABLES PARA LA CONSULTA
  const [unidadesaprendizajeList,setunidadesaprendizajeList] = useState([]);
  const [programaseducativosList,setprogramaseducativosList] = useState([]);
  const [docentesList,setdocentesList] = useState([]);
  const [filtroDocente, setfiltroDocente] = useState([]);
  const [gradosEstudio, setGradosEstudio] = useState([]);
  const [tiposEmpleados, setTiposEmpleados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);
  const dt = useRef(null);

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
  const save = () => {
    setFrmEnviado(true);
    //VALIDACION DE CAMPOS VACIOS
    if (!no_EmpleadoDocente || !horas_MinimasDocente || !horas_MaximasDocente || !horas_Externas || !clave_TipoEmpleado || !clave_GradoEstudio || !clave_Usuario) {
      setFrmEnviado(true);
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    if (!editando) {

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
              addUnidadAprendizaje();
              get();
              limpiarCampos();
            }
          }).catch(error=>{//EXCEPCIONES
            if (error.response.status === 400) {        
              mostrarAdvertencia("Clave ya Existente");
            }else if(error.response.status === 403){
              mostrarAdvertencia("Favor de Revisar las Horas");        
            }else if(error.response.status === 405){
              mostrarAdvertencia("El Usuario ya esta en uso");        
            }else if(error.response.status === 500){  
              mostrarError("Error interno del servidor");
            }     
          })
    } else {
        DocenteService.modificarDocente({
        no_EmpleadoDocente:no_EmpleadoDocente,
        horas_MinimasDocente:horas_MinimasDocente,
        horas_MaximasDocente:horas_MaximasDocente,
        horas_Externas:horas_Externas,
        clave_TipoEmpleado:clave_TipoEmpleado,
        clave_GradoEstudio:clave_GradoEstudio,
        clave_Usuario:clave_Usuario    
      }
      ).then(response => {//CASO EXITOSO
        if (response.status === 200) {                              
          eliminarImpartir();          
          addUnidadAprendizaje();
          mostrarExito("Modificación Exitosa");
          setFrmEnviado(false);
          seteditando(false);
          setMostrarDialog(false);
          get();
        }
      }).catch(error => {//EXCEPCIONES
        if (error.response.status === 400) {        
            mostrarAdvertencia("Clave ya Existente");
          }else if(error.response.status === 403){
            mostrarAdvertencia("Favor de Revisar las Horas");        
          }else if(error.response.status === 405){
            mostrarAdvertencia("El Usuario ya esta en uso");        
          }else if(error.response.status === 500){  
            mostrarError("Error interno del servidor");
          }
      })
    }
  }

  const eliminarImpartir = ()=>{
    if(unidadesseleccionadas.length ===0){// Si se desea que Unidades Aprendizaje a impartir pueda modificarse a vacio quitar
        return 0;
    }
    ImpartirUnidadAprendizajeService.eliminarImpartirUnidadAprendizaje({
        no_EmpleadoDocente:no_EmpleadoDocente
      }).then(response => {//CASO EXITOSO
        if (response.status === 200) {
          //mostrarExito("Eliminación Impartir Exitosa");          
        }
      }).catch(error => {//EXCEPCIONES
        if (error.response.status === 500) {
          mostrarError("Error interno del servidor");
        }
      })
  }
  const addUnidadAprendizaje = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!unidadesseleccionadas) {      
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }

    for (let i = 0; i < unidadesseleccionadas.length; i++) {                    
      ImpartirUnidadAprendizajeService.registrarImpartirUnidadAprendizajedos({
        clave_UnidadAprendizaje:unidadesseleccionadas[i],
          no_EmpleadoDocente:no_EmpleadoDocente     
      }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
          if(i===unidadesseleccionadas.length-1){
              //mostrarExito("Registro Exitoso");                            
          }
          //get();
          //limpiarCampos();
      }
      }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 500){  
          mostrarError("Error interno del servidor");
      }     
      });  
    }
    get();
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
  // FUNCION PARA ELIMINAR NOTA: delete parece ser una variable reservada
  const eliminar = ()=>{
    /*SalaService.eliminarSala({
      clave_Sala:clave_Sala
    }).then(response => {//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Eliminación Exitosa");
        get();
        setMostrarEliminarDialog(false);
        limpiarCampos();
      }
    }).catch(error => {//EXCEPCIONES
      if (error.response.status === 500) {
        mostrarError("Error interno del servidor");
      }
    })*/

  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS
  const limpiarCampos = () =>{
    setno_EmpleadoDocente("");
    sethoras_MinimasDocente("");    
    sethoras_MaximasDocente("");
    sethoras_Externas("");
    setclave_TipoEmpleado(null);
    setclave_GradoEstudio(null);
    setclave_Usuario(null);
    setunidadesseleccionadas([]);    
  };
  
  
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []); 

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
  
  //MANDAR A LLAMAR A LA LISTAS NECESARIAS PARA REGISTRAR
  useEffect(() => {
    // Lista Tipo Empleado
    TipoEmpleadoService.consultarTipoEmpleado()
      .then(response => {
        setTiposEmpleados(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos empleado:", error);
      });
    // Lista Grado Estudio
    GradoEstudioService.consultarGradoEstudio()
      .then(response => {
        setGradosEstudio(response.data);
      })
      .catch(error => {
        console.error("Error fetching grados estudio:", error);
      });
    // Lista Usuarios
    UsuarioService.consultarUsuario()
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error("Error fetching usuarios:", error);
      });
    // Lista Unidades Aprendizaje
    UnidadAprendizajeService.consultarUnidadAprendizaje()
      .then(response => {
        setunidadesaprendizajeList(response.data);
      })
      .catch(error => {
        console.error("Error fetching usuarios:", error);
      });
    // Lista Programas Educativos
    ProgramaEducativoService.consultarProgramaEducativo()
    .then(response => {
      setprogramaseducativosList(response.data);
    })
    .catch(error => {
      console.error("Error fetching usuarios:", error);
    });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
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

  //!!!EXTRAS VALIDACIONES CAMPOS

  const validarNumero = (value) => {
    // Expresión regular para validar números enteros positivos
    const regex = /^[0-9]\d*$/;
    // Verificar si el valor coincide con la expresión regular
    return value==='' || regex.test(value);
  };  

  //!!!EXTRAS DIALOG GUARDAR (REGISTRAR Y MODIFICAR)
  // Funcion para abrir Dialog para Registrar
  const abrirNuevo = () => {    
    setFrmEnviado(false);
    setMostrarDialog(true);
    limpiarCampos();
  };

  //Funcion para ocultar el Dialog de Guardado (Registrar o Modifcar)
  const esconderDialog = () => {
    setFrmEnviado(false);
    seteditando(false);    
    setMostrarDialog(false);
  };
  // Inicializa las constantes de la modificacion
  const inicializar = (docente) => {
    setno_EmpleadoDocente(docente.no_EmpleadoDocente);
    setclave_Usuario(docente.clave_Usuario);
    setclave_TipoEmpleado(docente.clave_TipoEmpleado);
    setclave_GradoEstudio(docente.clave_GradoEstudio);
    sethoras_MinimasDocente(docente.horas_MinimasDocente);
    sethoras_MaximasDocente(docente.horas_MaximasDocente);
    sethoras_Externas(docente.horas_Externas);
    const unidadesAprendizajeArray = docente.unidadesAprendizaje
    ? docente.unidadesAprendizaje.split(',').map(Number)
    : [];

    setunidadesseleccionadas(unidadesAprendizajeArray);
  }

  // Funcion para contenido de Footer del Dialog Guardado
  const footerDialog = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={esconderDialog}></Button>
      <Button label="Guardar" icon="pi pi-check" onClick={save} />
    </React.Fragment>
  );

  // Funcion para iniciar con Edición
  const editSala = (sala) => {
    inicializar(sala);    
    setMostrarDialog(true);
    seteditando(true);
  };
  
  // Funcion para exportar en formato de excel
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  //Lado Izquierdo del Toolbar, boton Nuevo y boton para congelar columna acciones
  const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={abrirNuevo}/>  
            <ToggleButton checked={accionesFrozen} onChange={(e) => setAccionesFrozen(e.value)} onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Acciones" offLabel="Acciones" />          
        </div>
    );
  };
  //Lado Derecho del Toolbar, boton Exportar
  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help"  onClick={exportCSV}/>;
  };
  
  //!!!EXTRAS DIALOG DE CONFIRMACION DE ELIMINAR
  // Funcion para ocultar Dialog de Eliminar
  const ocultarEliminarDialog = () => {
    setMostrarEliminarDialog(false);
  };
  // Funcion para el footer del Dialog de ELiminar
  const footerDialogEliminar = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={ocultarEliminarDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={eliminar}
      />
    </React.Fragment>
  );
  
  // Funcion para motrar el Dialog de Eliminar
  const confirmarEliminar = (sala) => {
    inicializar(sala);
    setMostrarEliminarDialog(true);
  };

  //!!!EXTRAS TABLA
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'no_EmpleadoDocente', header: 'NO.Empleado' },
    {field: 'horas_MinimasDocente', header: 'Horas Mínimas' },
    {field: 'horas_MaximasDocente', header: 'Horas Máximas' },
    {field: 'horas_Externas', header: 'Horas Externas' },
    {field: 'clave_TipoEmpleado', header: 'Tipo Empleado' },
    {field: 'clave_GradoEstudio', header: 'Grado Estudio' },
    {field: 'clave_Usuario', header: 'Usuario' },
    {field: 'unidadesAprendizaje', header: 'Unidades Aprendizaje' },
  ];

  //Cabecera de la Tabla
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Salas</h4>                              
        
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          //onInput={(e) => setGlobalFilter(e.target.value)}
        onInput={(e) => onSearch(e)}
          placeholder="Buscar..."
        />
      </IconField>
    </div>
    
  );

  // Contenido de la columna de Acciones (Modificar y Eliminar)
  const accionesTabla = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="m-1"
          onClick={() => editSala(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          className="m-1"
          onClick={() => confirmarEliminar(rowData)}
        />
      </React.Fragment>
    );
  };

  // Funcion Necesaria para filtrado
  const onFilter = (event) => {
    event['first'] = 0;
    setlazyState(event);
  };
 
  const manejoInputPrograma = (code, value) => {
    sethorasprogramaseducativos((prevValues) => ({
      ...prevValues,
      [code]: value,
    }));

    // Encuentra el ProgramaEducativo correspondiente
    const programaeducativo = programaseducativosList.find((p) => p.clave_ProgramaEducativo === code);

    // If the country is not already selected, add it to the selected countries
    if (programaeducativo && !programaseducativosseleccionados.some((p) => p.clave_ProgramaEducativo === code)) {
      setprogramaseducativosseleccionados((prevSelected) => [...prevSelected, programaeducativo]);
    }
  };

  const elementosProgramaEducativo = (option) => {
    return (
      <React.Fragment>
      <div className="flex align-items-center">
        <div>{option.clave_ProgramaEducativo} - {option.nombre_ProgramaEducativo}</div>
        <input
          type="text"
          value={horasprogramaseducativos[option.clave_ProgramaEducativo] || ''}
          onChange={(e) => manejoInputPrograma(option.clave_ProgramaEducativo, e.target.value)}
          placeholder="hrs"
          className="ml-2 p-inputtext p-component"
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
        />
      </div>
      </React.Fragment>
    );
  };

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />            
      {/*Dialog para Registrar y Modificar Sala*/} 
      <label className="block text-4xl font-bold mb-1">Docente</label>
      <Dialog
        visible={mostrarDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Sala"
        modal
        className="p-fluid"
        footer={footerDialog}
        onHide={esconderDialog}
      >    
        <div className="formgrid grid">
        <div className="field col">
            <label htmlFor="NoEmpleado" className="font-bold">
              NO.Empleado*
            </label>
            <InputText
              id="NoEmpleado"
              type="text" 
              keyfilter={/^[0-9]*$/}
              value={no_EmpleadoDocente}              
              onChange={(event)=>{
                if (validarNumero(event.target.value)) {
                  setno_EmpleadoDocente(event.target.value);
                }
              }} 
              required            
              maxLength={10}
              placeholder="Ej.12345678"
              className={classNames({ 'p-invalid': frmEnviado && !no_EmpleadoDocente })}
            />  
            {frmEnviado && !no_EmpleadoDocente && (
                <small className="p-error">Se requiere el Nombre.</small>
            )}          
          </div>
            <div className="field col">
                <label htmlFor="Usuario" className="font-bold">Usuario*</label>
                <Dropdown
                id="Usuario"
                value={clave_Usuario} 
                options={usuarios} 
                onChange={(e) => {
                    setclave_Usuario(e.value);
                }} 
                autoFocus
                required
                optionLabel = {(option) => `${option.correo} - ${option.nombre_Usuario} ${option.apellidoP_Usuario} ${option.apellidoM_Usuario}`}
                optionValue="clave_Usuario" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione un Usuario" 
                className={classNames({ 'p-invalid': frmEnviado && !clave_Usuario })}
                />
                {frmEnviado && !clave_Usuario && (
                    <small className="p-error">Se requiere el Edificio.</small>
                )}
            </div>            
        </div>           
        <div className="formgrid grid">
            <div className="field col">
                <label htmlFor="TipoEmpleado" className="font-bold">Tipo Empleado*</label>
                <Dropdown 
                id="TipoEmpleado"
                value={clave_TipoEmpleado} 
                options={tiposEmpleados} 
                onChange={(e) => {
                    setclave_TipoEmpleado(e.value);
                }} 
                required
                optionLabel = {(option) => `${option.clave_TipoEmpleado} - ${option.nombre_TipoEmpleado}`}
                optionValue="clave_TipoEmpleado" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione un Tipo de Empleado" 
                className={classNames({ 'p-invalid': frmEnviado && !clave_TipoEmpleado })}
                />
                {frmEnviado && !clave_TipoEmpleado && (
                    <small className="p-error">Se requiere el Tipo de Sala.</small>
                )}
            </div>
            <div className="field col">
                <label htmlFor="GradoEstudio" className="font-bold">Grado de Estudio*</label>
                <Dropdown 
                id="GradoEstudio"
                value={clave_GradoEstudio} 
                options={gradosEstudio} 
                onChange={(e) => {
                    setclave_GradoEstudio(e.value);
                }} 
                required
                optionLabel = {(option) => `${option.clave_GradoEstudio} - ${option.nombre_GradoEstudio}`}
                optionValue="clave_GradoEstudio" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione un Grado de Estudio" 
                className={classNames({ 'p-invalid': frmEnviado && !clave_GradoEstudio })}
                />
                {frmEnviado && !clave_GradoEstudio && (
                    <small className="p-error">Se requiere el Tipo de Sala.</small>
                )}
            </div>
        </div>
        <div className="field col">
            <label htmlFor="UnidadesAprendizaje" className="font-bold">Unidades Aprendizaje*</label>
            <MultiSelect 
            id="UnidadesAprendizaje"
            value={unidadesseleccionadas} 
            options={unidadesaprendizajeList} 
            onChange={(e) => {
                setunidadesseleccionadas(e.value);
            }} 
            required
            filter
            optionLabel = {(option) => `${option.clave_UnidadAprendizaje} - ${option.nombre_UnidadAprendizaje}`}
            optionValue="clave_UnidadAprendizaje" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Unidades de Aprendizaje a Impartir" 
            display="chip"
            className={classNames({ 'p-invalid': frmEnviado && !unidadesseleccionadas })}
            />
            {frmEnviado && !unidadesseleccionadas && (
                <small className="p-error">Se requiere el Material.</small>
            )}
          </div>
          <div className="field col">
            <label htmlFor="horasprogramaeducativo" className="font-bold">Programas Educativos*</label>
            <MultiSelect 
            id="horasprogramaeducativo"
            value={programaseducativosseleccionados} 
            options={programaseducativosList} 
            onChange={(e) => {
                setprogramaseducativosseleccionados(e.value);
            }} 
            required
            filter
            itemTemplate={elementosProgramaEducativo}
            //optionLabel = {(option) => `${option.clave_ProgramaEducativo} - ${option.nombre_ProgramaEducativo}`}
            optionValue="clave_ProgramaEducativo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Impartir en Programas Educativos" 
            display="chip"
            className={classNames({ 'p-invalid': frmEnviado && !programaseducativosseleccionados })}
            />
            {frmEnviado && !programaseducativosseleccionados && (
                <small className="p-error">Se requiere el Material.</small>
            )}
          </div>
            
        <div className="formgrid grid">                      
          <div className="field col">
              <label htmlFor="horasMinimas" className="font-bold">Horas Minimas*</label>
              <InputText id="horasMinimas" type="text" keyfilter={/^[0-9]*$/} value={horas_MinimasDocente} maxLength={2}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_MinimasDocente(event.target.value);
                    }
                  }}                    
                  required
                  placeholder="Ej.14"
                  className={classNames({ 'p-invalid': frmEnviado && !horas_MinimasDocente })}
              />
              {frmEnviado && !horas_MinimasDocente && (
                    <small className="p-error">Se requiere la Capacidad.</small>
                )} 
          </div>
          <div className="field col">
              <label htmlFor="horasMaximas" className="font-bold">Horas Maximas*</label>
              <InputText id="horasMaximas" type="text" keyfilter={/^[0-9]*$/} value={horas_MaximasDocente} maxLength={2}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_MaximasDocente(event.target.value);
                    }
                  }}                    
                  required
                  placeholder="Ej.20"
                  className={classNames({ 'p-invalid': frmEnviado && !horas_MaximasDocente })}
              />
              {frmEnviado && !horas_MaximasDocente && (
                    <small className="p-error">Se requiere la Capacidad.</small>
                )} 
          </div> 
          <div className="field col">
              <label htmlFor="horasExternas" className="font-bold">Horas Externas*</label>
              <InputText id="horasExternas" type="text" keyfilter={/^[0-9]*$/} value={horas_Externas} maxLength={2}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      sethoras_Externas(event.target.value);
                    }
                  }}                    
                  required
                  placeholder="Ej.5"
                  className={classNames({ 'p-invalid': frmEnviado && !horas_Externas })}
              />
              {frmEnviado && !horas_Externas && (
                    <small className="p-error">Se requiere la Capacidad.</small>
                )} 
          </div>                   
        </div>        
      </Dialog>
      {/*Dialog para Confirmación de eliminar*/} 
      <Dialog
        visible={mostrarEliminarDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirmar"
        modal
        footer={footerDialogEliminar}
        onHide={ocultarEliminarDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {no_EmpleadoDocente && (
            <span>
              ¿Está seguro de que quiere eliminar <b>{no_EmpleadoDocente}</b>?
            </span>
          )}
        </div>
      </Dialog>   
      {/*Barra de herramientas con boton nuevo, boton para anclar la columna de Acciones y Exportar*/} 
      <Toolbar className="mt-3" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
      {/*Tabla de Contenido*/}         
      <div className="card">        
        <DataTable ref={dt} value={filtroDocente.length ? filtroDocente :docentesList} scrollable scrollHeight="400px" size='small' tableStyle={{ minWidth: '50rem' }}         
        filterDisplay="row"         
        onFilter={onFilter}       
        filters={lazyState.filters}
          
          header={header}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
               filter filterPlaceholder="Buscar"/>;
          })}
          <Column
            body={accionesTabla}
            exportable={false}
            style={{ minWidth: '15%' }}
            alignFrozen="right" 
            frozen={accionesFrozen}
          ></Column>
        </DataTable>
      </div>            
    </>
  )
}

export default DocenteN