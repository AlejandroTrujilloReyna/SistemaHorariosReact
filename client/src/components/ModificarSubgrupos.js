import React from 'react'
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion} from '../services/ToastService';
import { Toolbar } from 'primereact/toolbar';//NUEVO
import { Dialog } from 'primereact/dialog';//NUEVO
import { IconField } from 'primereact/iconfield';//NUEVO
import { InputIcon } from 'primereact/inputicon';//NUEVO
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';//NUEVO
import { FilterMatchMode } from 'primereact/api';
import ModificarSubgruposService from '../services/ModificarSubgruposService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';

const ModificarSubgrupos = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_ModificarSubgrupos, setclave_ModificarSubgrupos] = useState(null);
  const [clave_ProgramaEducativo,setclave_ProgramaEducativo] = useState(null);
  const [clave_UnidadAprendizajePlanEstudios,setclave_UnidadAprendizajePlanEstudios] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [modificarsubgruposList, setmodificarsubgruposList] = useState([]);
  const [filtroModificarSubgrupos, setfiltroModificarSubgrupos] = useState([]);
  const [programaseducativos, setprogramaseducativos] = useState([]);
  const [unidadesaprenizajeplanesestudios, setunidadesaprenizajeplanesestudios] = useState([]);
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_ModificarSubgrupos: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_ProgramaEducativo: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_UnidadAprendizajePlanEstudios: { value: '', matchMode: FilterMatchMode.STARTS_WITH }
    },
  });
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    clave_ModificarSubgrupos: "",
    clave_ProgramaEducativo: "",
    clave_UnidadAprendizajePlanEstudios: ""
  });      
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);
  //ESTADOS PARA CONDICIONES
  const [enviado, setEnviado] = useState(false);
  const [abrirDialog,setAbrirDialog] = useState(0);
  
  const confirmar1 = (action) => {
    confirmDialog({
      message: '¿Seguro que quieres proceder?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      defaultFocus: 'accept',
      accept: action,
      reject: () => mostrarAdvertencia(toast, "Cancelado")
    });
  };  

  //FUNCION PARA REGISTRAR
  const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_ProgramaEducativo || !clave_UnidadAprendizajePlanEstudios) {
      mostrarAdvertencia(toast, "Existen campos Obligatorios vacíos");
      setEnviado(true);
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    const action = () => {
    ModificarSubgruposService.registrarModificarSubgrupos({
      clave_ProgramaEducativo:clave_ProgramaEducativo,
      clave_UnidadAprendizajePlanEstudios:clave_UnidadAprendizajePlanEstudios 
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito(toast, "Registro Exitoso");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia(toast, "Registro ya existente");
      }else if(error.response.status === 500){          
        mostrarError(toast, "Error interno del servidor");
      }     
    });
    };confirmar1(action);
  }

  //FUNCION PARA CONSULTA
  const get = ()=>{
    ModificarSubgruposService.consultarModificarSubgrupos().then((response)=>{//CASO EXITOSO
      setmodificarsubgruposList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("toast, Error del sistema");
      }
    });    
  }
  
  //FUNCION PARA LA MODIFICACION
  const put = () =>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_ProgramaEducativo || !clave_UnidadAprendizajePlanEstudios) {
      mostrarAdvertencia(toast, "Existen campos Obligatorios vacíos");
      setEnviado(true);
      return;
    }    
    if (clave_ModificarSubgrupos === datosCopia.clave_ModificarSubgrupos
      && clave_ProgramaEducativo === datosCopia.clave_ProgramaEducativo
      && clave_UnidadAprendizajePlanEstudios === datosCopia.clave_UnidadAprendizajePlanEstudios) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {      
    ModificarSubgruposService.modificarModificarSubgrupos({
      clave_ModificarSubgrupos:clave_ModificarSubgrupos,
      clave_ProgramaEducativo:clave_ProgramaEducativo,
      clave_UnidadAprendizajePlanEstudios:clave_UnidadAprendizajePlanEstudios 
    }).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito(toast, "Modificación Exitosa");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 400){
        mostrarAdvertencia(toast, "Registro ya existente");
        get();
      }else if(error.response.status === 500){
        mostrarError(toast, "Error del sistema");
      }
    });
    };confirmar1(action);
  }  
  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_ProgramaEducativo(null);
    setclave_UnidadAprendizajePlanEstudios(null);
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_ModificarSubgrupos', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'clave_ProgramaEducativo', header: 'Programa Educativo', filterHeader: 'Filtro por Programa Educativo' },
    {field: 'clave_UnidadAprendizajePlanEstudios', header: 'Unidad de Aprendizaje', filterHeader: 'Filtro por Unidad de Aprendizaje'}
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = modificarsubgruposList.filter((item) => {
        return (
            item.clave_ModificarSubgrupos.toString().includes(value) ||
            item.clave_ProgramaEducativo.toString().includes(value) ||
            item.clave_UnidadAprendizajePlanEstudios.toString().includes(value)          
        );
    });
    setfiltroModificarSubgrupos(filteredData);
  };
  
  //BOTON PARA MODIFICAR
  const accionesTabla = (rowData) => {
    return (<>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="m-1"
          onClick={() => {
            setclave_ModificarSubgrupos(rowData.clave_ModificarSubgrupos);
            setclave_ProgramaEducativo(rowData.clave_ProgramaEducativo);
            setclave_UnidadAprendizajePlanEstudios(rowData.clave_UnidadAprendizajePlanEstudios);
            setDatosCopia({
              clave_ModificarSubgrupos: rowData.clave_ModificarSubgrupos,
              clave_ProgramaEducativo: rowData.clave_ProgramaEducativo,
              clave_UnidadAprendizajePlanEstudios: rowData.clave_UnidadAprendizajePlanEstudios
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
  };   

  //MANDAR A LLAMAR A LA LISTA DE PROGRAMAS EDUCATIVOS
  useEffect(() => {
    ProgramaEducativoService.consultarProgramaEducativo()
      .then(response => {
        setprogramaseducativos(response.data);
      })
      .catch(error => {
        console.error("Error fetching programas educativos:", error);
      });
   }, []);
   
  //MANDAR A LLAMAR A LA LISTA DE UNIDADES DE APRENDIZAJE DE UN PLAN DE ESTUDIOS
  useEffect(() => {
    ModificarSubgruposService.obtenerUAPE()
      .then(response => {
        setunidadesaprenizajeplanesestudios(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades de aprendizaje de un plan de estudios:", error);
      });
   }, []);
   
  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_ProgramaEducativo') {
      const programa = programaseducativos.find((programa) => programa.clave_ProgramaEducativo === rowData.clave_ProgramaEducativo);
      return programa ? `${programa.nombre_ProgramaEducativo}` : '';
    }else if(field === 'clave_UnidadAprendizajePlanEstudios'){
      const uap = unidadesaprenizajeplanesestudios.find((uap) => uap.clave_UnidadAprendizajePlanEstudios === rowData.clave_UnidadAprendizajePlanEstudios);
      return uap ? `${uap.clave_UnidadAprendizaje}` : '';      
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };

  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Asignación de subgrupos</h4>)}
      {abrirDialog===2 && (<h4>Modificar Asignación de subgrupos</h4>)}
    </div>
  );
  
  //LISTA DE OPCIONES DE HERRAMIENTAS
  const Herramientas = () => {
    return (<div className="flex justify-content-between flex-wrap gap-2 align-items-center">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={()=>setAbrirDialog(1)}/>
            <Button label="Exportar" icon="pi pi-upload" className="p-button-help"  onClick={()=>{dt.current.exportCSV();}}/>
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch}/>  
              </IconField>
            </div>              
    );
  };  

  //FUNCION PARA ACTIVAR EL FILTRADO
  const onFilter = (event) => {
    event['first'] = 0;
    setlazyState(event);
  };  

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
    <Toolbar start={<h2 className="m-0">Asignar Subgrupos </h2>} end={Herramientas}/>
    <ConfirmDialog />
    <Dialog className='w-8' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-6">
              <label>Programa Educativo*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_ProgramaEducativo}
              value={clave_ProgramaEducativo} 
              options={programaseducativos} 
              onChange={(e) => {
                setclave_ProgramaEducativo(e.value);
              }} 
              optionLabel="nombre_ProgramaEducativo" 
              optionValue="clave_ProgramaEducativo"
              placeholder="Seleccione un Programa Educativo" 
            />
          </div>
          <div className="field col-6">
            <label>Unidad de Aprendizaje*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_UnidadAprendizajePlanEstudios}
              value={clave_UnidadAprendizajePlanEstudios} 
              options={unidadesaprenizajeplanesestudios} 
              onChange={(e) => {
                setclave_UnidadAprendizajePlanEstudios(e.value);
              }} 
              optionLabel="clave_UnidadAprendizaje" 
              optionValue="clave_UnidadAprendizajePlanEstudios"
              placeholder="Seleccione una Unidad de Aprendizaje" 
            />
          </div>                                                                                      
        </div>
        <div className="formgrid grid justify-content-end">
          <Button label="Cancelar" icon="pi pi-times" outlined className='m-2' onClick={() => {setAbrirDialog(0); setEnviado(false); limpiarCampos();}} severity='secondary' />
          {abrirDialog===1 && (
            <Button label="Guardar" icon="pi pi-check" className='m-2' onClick={add} severity='success' />
          )}
          {abrirDialog===2 && (
            <Button label="Editar" icon="pi pi-check" className='m-2' onClick={put} severity='success' />
          )}          
        </div>    
    </Dialog>
    {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <DataTable
      onFilter={onFilter} filters={lazyState.filters} filterDisplay="row"  
      ref={dt} 
      value={filtroModificarSubgrupos.length ? filtroModificarSubgrupos :modificarsubgruposList} 
      size='small'
      scrollable scrollHeight="78vh">
        {columns.map(({ field, header, filterHeader }) => {
            return <Column 
            filterMatchModeOptions={[
              { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH },
              { label: 'Contiene', value: FilterMatchMode.CONTAINS },
              { label: 'No contiene', value: FilterMatchMode.NOT_CONTAINS },
              { label: 'Termina con', value: FilterMatchMode.ENDS_WITH },
              { label: 'Igual', value: FilterMatchMode.EQUALS },
              { label: 'No igual', value: FilterMatchMode.NOT_EQUALS },
            ]} 
            sortable filter filterPlaceholder={filterHeader} key={field} field={field} header={header} style={{minWidth:'40vh'}} bodyStyle={{textAlign:'center'}} body={(rowData) => renderBody(rowData, field)}/>;
        })}
        <Column body={accionesTabla} alignFrozen={'right'} frozen={true}></Column>  
      </DataTable>         
    </>
  )
}

export default ModificarSubgrupos