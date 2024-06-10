import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import UnidadAprendizajePlanEstudiosService from '../services/UnidadAprendizajePlanEstudiosService';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import { validarNumero } from '../services/ValidacionGlobalService';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import EtapaService from '../services/EtapaService';
import ClasificacionUnidadAprendizajeService from '../services/ClasificacionUnidadAprendizajeService';
import PlanEstudiosService from '../services/PlanEstudiosService';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';

const UnidadAprendizajePlanEstudios = () => {

 //VARIABLES PARA EL REGISTRO
 const [clave_UnidadAprendizajePlanEstudios,setclave_UnidadAprendizajePlanEstudios] = useState("");
 const [semestre,setsemestre] = useState("");
 const [clave_ClasificacionUnidadAprendizaje,setclave_ClasificacionUnidadAprendizaje] = useState(null);
 const [clave_Etapa,setclave_Etapa] = useState(null);
 const [clave_PlanEstudios, setclave_PlanEstudios] = useState(null);
 const [clave_UnidadAprendizaje, setclave_UnidadAprendizaje] = useState(null);
 //VARIABLES PARA LA CONSULTA
 const [unidadaprendizajeplanestudioslist,setunidadaprendizajeplanestudioslist] = useState([]);
 const [filtroUnidadAprendizajePlanEstudios, setfiltroUnidadAprendizajePlanEstudios] = useState([]);
 const [clasificacionesunidadaprendizaje, setclasificacionesunidadaprendizaje] = useState([]);
 const [etapas, setetapas] = useState([]);
 const [planestudios, setplanestudios] = useState([]);
 const [unidadesaprendizaje, setunidadesaprendizaje] = useState([]);
 const dt = useRef(null);
 const [lazyState, setlazyState] = useState({
  filters: {
    clave_UnidadAprendizajePlanEstudios: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    semestre: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    clave_ClasificacionUnidadAprendizaje: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    clave_Etapa: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    clave_PlanEstudios: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    clave_UnidadAprendizaje: { value: '', matchMode: FilterMatchMode.STARTS_WITH }
  },
 });
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    clave_UnidadAprendizajePlanEstudios: "",
    semestre: "",
    clave_ClasificacionUnidadAprendizaje: "",
    clave_Etapa: "",
    clave_PlanEstudios: "",
    clave_UnidadAprendizaje: ""
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
    if (!semestre || !clave_ClasificacionUnidadAprendizaje || !clave_Etapa || !clave_PlanEstudios || !clave_UnidadAprendizaje) {      
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    const action = () => {  
    UnidadAprendizajePlanEstudiosService.registrarUnidadAprendizajePlanEstudios({
      semestre:semestre,
      clave_ClasificacionUnidadAprendizaje:clave_ClasificacionUnidadAprendizaje,
      clave_Etapa:clave_Etapa,
      clave_PlanEstudios:clave_PlanEstudios,
      clave_UnidadAprendizaje:clave_UnidadAprendizaje   
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito(toast,"Registro Exitoso");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);    
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 500){  
        mostrarError(toast,"Error interno del servidor");
      }     
    });
    };confirmar1(action);
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    UnidadAprendizajePlanEstudiosService.consultarUnidadAprendizajePlanEstudios().then((response)=>{//CASO EXITOSO
      setunidadaprendizajeplanestudioslist(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () =>{
    if (!semestre || !clave_ClasificacionUnidadAprendizaje || !clave_Etapa || !clave_PlanEstudios || !clave_UnidadAprendizaje) {      
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }    
    if (clave_UnidadAprendizajePlanEstudios === datosCopia.clave_UnidadAprendizajePlanEstudios
      && semestre === datosCopia.semestre
      && clave_ClasificacionUnidadAprendizaje === datosCopia.clave_ClasificacionUnidadAprendizaje
      && clave_Etapa === datosCopia.clave_Etapa
      && clave_PlanEstudios === datosCopia.clave_PlanEstudios
      && clave_UnidadAprendizaje === datosCopia.clave_UnidadAprendizaje) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {      
    UnidadAprendizajePlanEstudiosService.modificarUnidadAprendizajePlanEstudios({
      clave_UnidadAprendizajePlanEstudios:clave_UnidadAprendizajePlanEstudios,
      semestre:semestre,
      clave_ClasificacionUnidadAprendizaje:clave_ClasificacionUnidadAprendizaje,
      clave_Etapa:clave_Etapa,
      clave_PlanEstudios:clave_PlanEstudios,
      clave_UnidadAprendizaje:clave_UnidadAprendizaje         
    }).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito(toast, "Modificación Exitosa");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);       
      }
    }).catch(error=>{//EXCEPCIONES
     if (error.response.status === 500) {
        mostrarError(toast,"Error del sistema");
      }
    });
    };confirmar1(action);
  }
  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setsemestre("");
    setclave_ClasificacionUnidadAprendizaje(null);
    setclave_Etapa(null);
    setclave_PlanEstudios(null);
    setclave_UnidadAprendizaje(null);
  } 

//!!!EXTRAS DE CONSULTA
//COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_UnidadAprendizajePlanEstudios', header: 'clave', filterHeader: 'Filtro por Clave' },
    {field: 'semestre', header: 'Semestre', filterHeader: 'Filtro por Semestre' },
    {field: 'clave_ClasificacionUnidadAprendizaje', header: 'Clasificacion', filterHeader: 'Filtro por Clasificacion' },
    {field: 'clave_Etapa', header: 'Etapa', filterHeader: 'Filtro por Etapa' },
    {field: 'clave_PlanEstudios', header: 'Plan de estudios', filterHeader: 'Filtro por Plan de estudios' },
    {field: 'clave_UnidadAprendizaje', header: 'Unidad de Aprendizaje', filterHeader: 'Filtro por Unidad de Aprendizaje' },
   
  ];

   //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
   useEffect(() => {
    get();
  },[]);
  
//FUNCION PARA LA BARRA DE BUSQUEDA
const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = unidadaprendizajeplanestudioslist.filter((item) => {
    
    const nombreClasifi = clasificacionesunidadaprendizaje.find(clasi => clasi.clave_ClasificacionUnidadAprendizaje === item.clave_ClasificacionUnidadAprendizaje)?.nombre_ClasificacionUnidAdaprendizaje || '';
    const nombre_Etapa = etapas.find(etap => etap.clave_Etapa === item.clave_Etapa)?.nombre_Etapa || '';  
    const nombre_PlanEs = planestudios.find(plan => plan.clave_PlanEstudios === item.clave_PlanEstudios)?.nombre_PlanEstudios || '';
    const nombre_UnidadAprend = unidadesaprendizaje.find(unidad => unidad.clave_UnidadAprendizaje === item.clave_UnidadAprendizaje)?.nombre_UnidadAprendizaje || '';
        return (
        item.semestre.toString().includes(value) ||
        nombreClasifi.toLowerCase().includes(value) ||
        nombre_Etapa.toLowerCase().includes(value) ||
        nombre_PlanEs.toLowerCase().includes(value)  ||
        nombre_UnidadAprend.toLowerCase().includes(value)  
        );
    });
    setfiltroUnidadAprendizajePlanEstudios(filteredData);
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
            setclave_UnidadAprendizajePlanEstudios(rowData.clave_UnidadAprendizajePlanEstudios);
            setsemestre(rowData.semestre);
            setclave_ClasificacionUnidadAprendizaje(rowData.clave_ClasificacionUnidadAprendizaje);
            setclave_Etapa(rowData.clave_Etapa);
            setclave_PlanEstudios(rowData.clave_PlanEstudios);
            setclave_UnidadAprendizaje(rowData.clave_UnidadAprendizaje);
            setDatosCopia({
              clave_UnidadAprendizajePlanEstudios: rowData.clave_UnidadAprendizajePlanEstudios,
              semestre: rowData.semestre,
              clave_ClasificacionUnidadAprendizaje: rowData.clave_ClasificacionUnidadAprendizaje,
              clave_Etapa: rowData.clave_Etapa,
              clave_PlanEstudios: rowData.clave_PlanEstudios,
              clave_UnidadAprendizaje: rowData.clave_UnidadAprendizaje
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
  };    

 //MANDAR A LLAMAR A LA LISTA DE CLASIFICACION DE UNIDAD DE APRENDIZAJE
 useEffect(() => {
    ClasificacionUnidadAprendizajeService.consultarClasificacionUnidadAprendizaje()
      .then(response => {
        setclasificacionesunidadaprendizaje(response.data);
      })
      .catch(error => {
        console.error("Error fetching clasificacion:", error);
      });
  }, []);
  
 //MANDAR A LLAMAR A LA LISTA DE ETAPAS
 useEffect(() => {
    EtapaService.consultarEtapa()
      .then(response => {
        setetapas(response.data);
      })
      .catch(error => {
        console.error("Error fetching Etapas:", error);
      });
  }, []);

 //MANDAR A LLAMAR A LA LISTA DE PLAN DE ESTUDIOS
 useEffect(() => {
    PlanEstudiosService.consultarPlanestudios()
      .then(response => {
        setplanestudios(response.data);
      })
      .catch(error => {
        console.error("Error plan de estudios:", error);
      });
  }, []);

 //MANDAR A LLAMAR A LA LISTA DE UNIDADES DE APRENDIZAJE
 useEffect(() => {
   UnidadAprendizajeService.consultarUnidadAprendizaje()
      .then(response => {
        setunidadesaprendizaje(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades de aprendizaje:", error);
      });
  }, []);

//FUNCION PARA QUE SE MUESTRE LA INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
const renderBody = (rowData, field) => {
    if (field === 'clave_ClasificacionUnidadAprendizaje') {
      const clasi = clasificacionesunidadaprendizaje.find((clasi) => clasi.clave_ClasificacionUnidAdaprendizaje === rowData.clave_ClasificacionUnidadAprendizaje);
      return clasi ? `${clasi.nombre_ClasificacionUnidAdaprendizaje} ` : '';
    } else if (field === 'clave_Etapa') {
      const eta = etapas.find((eta) => eta.clave_Etapa === rowData.clave_Etapa);
      return eta ? `${eta.nombre_Etapa} ` : '';
    } else if (field === 'clave_PlanEstudios') {
        const plan = planestudios.find((plan) => plan.clave_PlanEstudios === rowData.clave_PlanEstudios);
        return plan ? `${plan.nombre_PlanEstudios} ` : '';
    } else if (field === 'clave_UnidadAprendizaje') {
        const unid = unidadesaprendizaje.find((unid) => unid.clave_UnidadAprendizaje === rowData.clave_UnidadAprendizaje);
        return unid ? `${unid.nombre_UnidadAprendizaje} ` : '';
    } else {
      return rowData[field];
    }
  };

  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Unidad de Aprendizaje en un Plan de Estudios</h4>)}
      {abrirDialog===2 && (<h4>Modificar Unidad de Aprendizaje en un Plan de Estudios</h4>)}
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
    <Toolbar start={<h2 className="m-0">Unidad de Aprendizaje en un Plan de Estudios</h2>} end={Herramientas}/>
    <ConfirmDialog />
      {/*PANEL PARA EL REGISTRO*/}
      <Dialog className='w-10' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>        
        <div className="formgrid grid mx-8 justify-content-center">
        <div className="field col-4">
            <label>Unidad de Aprendizaje*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_UnidadAprendizaje}
              value={clave_UnidadAprendizaje} 
              options={unidadesaprendizaje} 
              onChange={(e) => {
                setclave_UnidadAprendizaje(e.value);
              }} 
              optionLabel="nombre_UnidadAprendizaje" 
              optionValue="clave_UnidadAprendizaje" 
              placeholder="Seleccione la Unidad de Aprendizaje"               
            />
          </div>
          <div className="field col-4">
            <label>Plan de Estudios*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_PlanEstudios}
              value={clave_PlanEstudios} 
              options={planestudios} 
              onChange={(e) => {
                setclave_PlanEstudios(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel="nombre_PlanEstudios" 
              optionValue="clave_PlanEstudios" 
              placeholder="Seleccione el Plan de Estudios"               
            />
          </div>
          <div className="field col-4">
            <label>Clasificacion*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_ClasificacionUnidadAprendizaje}
              value={clave_ClasificacionUnidadAprendizaje} 
              options={clasificacionesunidadaprendizaje} 
              onChange={(e) => {
                setclave_ClasificacionUnidadAprendizaje(e.value);
              }} 
              optionLabel="nombre_ClasificacionUnidAdaprendizaje" 
              optionValue="clave_ClasificacionUnidAdaprendizaje" 
              placeholder="Seleccione el tipo de clasificacion"               
            />
          </div>
          <div className="field col-3">
            <label>Etapa*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_Etapa}
              value={clave_Etapa} 
              options={etapas} 
              onChange={(e) => {
                setclave_Etapa(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel="nombre_Etapa" 
              optionValue="clave_Etapa" 
              placeholder="Seleccione la Etapa"               
            />
          </div>
          <div className="field col-2">
              <label>Semestre*</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={semestre} maxLength={3}
                  invalid={enviado===true && !semestre}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setsemestre(event.target.value);
                    }
                  }} 
                  placeholder="Ej.12345678" 
              className="w-full"/>
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
        <DataTable ref={dt} 
        value={filtroUnidadAprendizajePlanEstudios.length ? filtroUnidadAprendizajePlanEstudios :unidadaprendizajeplanestudioslist} 
        size='small' 
        scrollable scrollHeight="78vh"
        onFilter={onFilter} filters={lazyState.filters} filterDisplay="row" >
          {columns.map(({ field, header, filterHeader }) => {
              return <Column sortable filter filterPlaceholder={filterHeader} key={field} field={field} header={header} style={{minWidth:'40vh'}} bodyStyle={{textAlign:'center'}}
              body={(rowData) => renderBody(rowData, field)} 
              filterMatchModeOptions={[
                { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH },
                { label: 'Contiene', value: FilterMatchMode.CONTAINS },
                { label: 'No contiene', value: FilterMatchMode.NOT_CONTAINS },
                { label: 'Termina con', value: FilterMatchMode.ENDS_WITH },
                { label: 'Igual', value: FilterMatchMode.EQUALS },
                { label: 'No igual', value: FilterMatchMode.NOT_EQUALS },
              ]} />;
          })}
          <Column body={accionesTabla} alignFrozen={'right'} frozen={true}></Column>
        </DataTable>
    </>

)

}
export default UnidadAprendizajePlanEstudios