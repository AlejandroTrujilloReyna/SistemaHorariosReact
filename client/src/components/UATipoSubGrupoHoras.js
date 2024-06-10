import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import {validarNumero} from '../services/ValidacionGlobalService';//AGREGADO
import { Toolbar } from 'primereact/toolbar';//NUEVO
import { Dialog } from 'primereact/dialog';//NUEVO
import { IconField } from 'primereact/iconfield';//NUEVO
import { InputIcon } from 'primereact/inputicon';//NUEVO
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';//NUEVO
import { FilterMatchMode } from 'primereact/api';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';
import TipoSubGrupoService from '../services/TipoSubGrupoService';
import UATipoSubGrupoHorasService from '../services/UATipoSubGrupoHorasService'

const UATipoSubGrupoHoras = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_UATipoSubGrupoHoras,setclave_UATipoSubGrupoHoras] = useState(null);
  const [horas,sethoras] = useState("");
  const [clave_UnidadAprendizaje,setclave_UnidadAprendizaje] = useState(null);
  const [clave_TipoSubGrupo,setclave_TipoSubGrupo] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [uatiposubgrupohorasList,setuatiposubgrupohorasList] = useState([]);
  const [filtrouatiposubgrupohoras, setfiltrouatiposubgrupohoras] = useState([]);
  const [TiposSubgrupos, setTiposSubgrupos] = useState([]);
  const [UnidadesAprendizaje, setUnidadesAprendizaje] = useState([]);
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_UATipoSubGrupoHoras: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      horas: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_UnidadAprendizaje: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_TipoSubGrupo: { value: '', matchMode: FilterMatchMode.STARTS_WITH }
    },
  })
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    clave_UATipoSubGrupoHoras: "",
    horas: "",
    clave_UnidadAprendizaje: "",
    clave_TipoSubGrupo: ""
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
    if (!clave_TipoSubGrupo || !clave_UnidadAprendizaje || !horas) {
      mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
      setEnviado(true);
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    const action = () => {
    UATipoSubGrupoHorasService.registrarUATipoSubGrupoHoras({
      horas:horas,
      clave_TipoSubGrupo:clave_TipoSubGrupo,
      clave_UnidadAprendizaje:clave_UnidadAprendizaje,
    
    }).then(response=>{
      if (response.status === 200) {
        mostrarExito(toast,"Registro Exitoso");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{
      if (error.response.status === 401) {
        mostrarAdvertencia(toast,"Subgrupo ya existente para esa Unidad de Aprendizaje");      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }     
    });
    };confirmar1(action); 
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    UATipoSubGrupoHorasService.consultarUATipoSubGrupoHoras().then((response)=>{
      setuatiposubgrupohorasList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
      }
    });   
  }

  //FUNCION PARA LA MODIFICACION
  const put = () =>{
    if (!clave_TipoSubGrupo || !clave_UnidadAprendizaje || !horas) {
      mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
      setEnviado(true);
      return;
    }    
    if (clave_UATipoSubGrupoHoras === datosCopia.clave_UATipoSubGrupoHoras
      && horas === datosCopia.horas
      && clave_TipoSubGrupo === datosCopia.clave_TipoSubGrupo
      && clave_UnidadAprendizaje === datosCopia.clave_UnidadAprendizaje) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {
    UATipoSubGrupoHorasService.modificarUATipoSubGrupoHoras({
      clave_UATipoSubGrupoHoras,
      horas:horas,
      clave_TipoSubGrupo:clave_TipoSubGrupo,
      clave_UnidadAprendizaje:clave_UnidadAprendizaje
    }).then(response=>{
      if(response.status === 200){
        mostrarExito(toast, "Modificación Exitosa");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia(toast,"Tipo de subgrupo existente en la Unidad de Aprendizaje");
        get();
      }else if(error.response.status === 500){
        mostrarError(toast,"Error del sistema");
      }
    });
    };confirmar1(action);
  }

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_TipoSubGrupo("");
    setclave_UnidadAprendizaje("");
    sethoras("");
  }
  
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_UATipoSubGrupoHoras', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'horas', header: 'Horas', filterHeader: 'Filtro por Horas' },
    {field: 'clave_UnidadAprendizaje', header: 'Unidad de Aprendizaje', filterHeader: 'Filtro por Unidad de Aprendizaje'},
    {field: 'clave_TipoSubGrupo', header: 'Tipo SubGrupo', filterHeader: 'Filtro por Tipo Subgrupo'},
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = uatiposubgrupohorasList.filter((item) => {
        return (
            item.clave_UATipoSubGrupoHoras.toString().includes(value) ||
            item.clave_TipoSubGrupo.toString().includes(value) ||
            item.clave_UnidadAprendizaje.toString().includes(value) ||
            item.horas.toString().includes(value)          
        );
    });
    setfiltrouatiposubgrupohoras(filteredData);
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
            setclave_UATipoSubGrupoHoras(rowData.clave_UATipoSubGrupoHoras);
            sethoras(rowData.horas);
            setclave_UnidadAprendizaje(rowData.clave_UnidadAprendizaje);
            setclave_TipoSubGrupo(rowData.clave_TipoSubGrupo);
            setDatosCopia({
              clave_UATipoSubGrupoHoras: rowData.clave_UATipoSubGrupoHoras,
              horas: rowData.horas,
              clave_UnidadAprendizaje: rowData.clave_UnidadAprendizaje,
              clave_TipoSubGrupo: rowData.clave_TipoSubGrupo
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
  };   

  //MANDAR A LLAMAR A LA LISTA DE TIPOS DE SUBGRUPO
  useEffect(() => {
    TipoSubGrupoService.consultarTipoSubGrupo()
      .then(response => {
        setTiposSubgrupos(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos sub grupos:", error);
      });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE UNIDADES DE APRENDIZAJE
  useEffect(() => {
    UnidadAprendizajeService.consultarUnidadAprendizaje()
      .then(response => {
        setUnidadesAprendizaje(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos sub grupos:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_TipoSubGrupo') {
      const unidad = TiposSubgrupos.find((unidad) => unidad.clave_TipoSubGrupo === rowData.clave_TipoSubGrupo);
      return unidad ? `${unidad.nombre_TipoSubGrupo}` : '';
    }else if(field === 'clave_UnidadAprendizaje'){
      const unidad = UnidadesAprendizaje.find((unidad) => unidad.clave_UnidadAprendizaje === rowData.clave_UnidadAprendizaje);
      return unidad ? `${unidad.nombre_UnidadAprendizaje}` : '';      
    }else {
      return rowData[field];
    }
  };

  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Unidad de Aprendizaje con Subgrupos</h4>)}
      {abrirDialog===2 && (<h4>Modificar Unidad de Aprendizaje con Subgrupos</h4>)}
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
    <Toast ref={toast} />
    <Toolbar start={<h2 className="m-0">Unidad de Aprendizaje con Subgrupos</h2>} end={Herramientas}/>
    <ConfirmDialog />
      <Dialog className='w-8' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-2">
              <label>Horas*</label>
              <InputText type="text" keyfilter="pint" value={horas} maxLength={10}
              invalid={enviado===true && !horas}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	sethoras(event.target.value);
                    }
                  }}  
                  placeholder="Ej.3"
              className="w-full"/>
          </div>
          <div className="field col-6">
              <label>Tipo SubGrupo*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_TipoSubGrupo}
              value={clave_TipoSubGrupo} 
              options={TiposSubgrupos} 
              onChange={(e) => {
                setclave_TipoSubGrupo(e.value);
              }} 
              optionLabel="nombre_TipoSubGrupo" 
              optionValue="clave_TipoSubGrupo"
              placeholder="Seleccione un Tipo de Sub Grupo" 
            />
          </div>                                                                           
          <div className="field col-6">
              <label>Unidad Aprendizaje*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_UnidadAprendizaje}
              value={clave_UnidadAprendizaje} 
              options={UnidadesAprendizaje} 
              onChange={(e) => {
                setclave_UnidadAprendizaje(e.value);
              }} 
              optionLabel="nombre_UnidadAprendizaje" 
              optionValue="clave_UnidadAprendizaje"
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
        value={filtrouatiposubgrupohoras.length ? filtrouatiposubgrupohoras :uatiposubgrupohorasList}
        scrollable scrollHeight="78vh"
        size='small'>
          {columns.map(({ field, header, filterHeader }) => {
              return <Column sortable key={field} field={field} header={header} body={(rowData) => renderBody(rowData, field)} style={{minWidth:'40vh'}} bodyStyle={{textAlign:'center'}}
              filterMatchModeOptions={[
                { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH },
                { label: 'Contiene', value: FilterMatchMode.CONTAINS },
                { label: 'No contiene', value: FilterMatchMode.NOT_CONTAINS },
                { label: 'Termina con', value: FilterMatchMode.ENDS_WITH },
                { label: 'Igual', value: FilterMatchMode.EQUALS },
                { label: 'No igual', value: FilterMatchMode.NOT_EQUALS },
              ]}
              filter filterPlaceholder={filterHeader}/>;
          })}
          <Column body={accionesTabla} alignFrozen={'right'} frozen={true}></Column> 
        </DataTable> 
    </>
  )
}

export default UATipoSubGrupoHoras