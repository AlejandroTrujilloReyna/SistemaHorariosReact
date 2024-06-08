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
import { validarTexto, validarNumero} from '../services/ValidacionGlobalService';//AGREGADO
import { Toolbar } from 'primereact/toolbar';//NUEVO
import { Dialog } from 'primereact/dialog';//NUEVO
import { IconField } from 'primereact/iconfield';//NUEVO
import { InputIcon } from 'primereact/inputicon';//NUEVO
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';//NUEVO
import { FilterMatchMode } from 'primereact/api';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';
import PlanEstudiosService from '../services/PlanEstudiosService';

const UnidadAprendizaje = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_PlanEstudios,setclave_PlanEstudios] = useState(null);
  const [clave_UnidadAprendizaje,setclave_UnidadAprendizaje] = useState(0);
  const [nombre_UnidadAprendizaje,setnombre_UnidadAprendizaje] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [unidadaprendizajeList,setunidadaprendizajeList] = useState([]);
  const [filtrounidadaprendizaje, setfiltrounidadaprendizaje] = useState([]);
  const [planes, setplanes] = useState([]);
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_PlanEstudios: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_UnidadAprendizaje: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      nombre_UnidadAprendizaje: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    },
  });  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);
  const [datosCopia, setDatosCopia] = useState({
    clave_PlanEstudios: "",
    clave_UnidadAprendizaje: 0,
    nombre_UnidadAprendizaje: ""
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
    if (!clave_PlanEstudios || !clave_UnidadAprendizaje || !nombre_UnidadAprendizaje) {
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    const action = () => {
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UnidadAprendizajeService.registrarUnidadAprendizaje({
      clave_PlanEstudios:clave_PlanEstudios,
      clave_UnidadAprendizaje:clave_UnidadAprendizaje,
      nombre_UnidadAprendizaje:nombre_UnidadAprendizaje,
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito(toast,"Registro Exitoso");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia(toast,"Clave ya Existente");
      } else if (error.response.status === 401) {
        mostrarAdvertencia(toast,"Nombre ya existente");      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }     
    });    
    };
    confirmar1(action);
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    UnidadAprendizajeService.consultarUnidadAprendizaje().then((response)=>{//CASO EXITOSO
      setunidadaprendizajeList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () =>{
  if (!clave_PlanEstudios || !clave_UnidadAprendizaje || !nombre_UnidadAprendizaje) {
    mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
    setEnviado(true);
    return;
  }
  if (clave_PlanEstudios === datosCopia.clave_PlanEstudios
    && clave_UnidadAprendizaje === datosCopia.clave_UnidadAprendizaje
    && nombre_UnidadAprendizaje === datosCopia.nombre_UnidadAprendizaje) {
    mostrarInformacion(toast, "No se han realizado cambios");
    setAbrirDialog(0);
    limpiarCampos();
    return;
  }
  const action = () => {  
  UnidadAprendizajeService.modificarUnidadAprendizaje({
    clave_PlanEstudios:clave_PlanEstudios,
    clave_UnidadAprendizaje:clave_UnidadAprendizaje,
    nombre_UnidadAprendizaje:nombre_UnidadAprendizaje
    }).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito(toast, "Modificación Exitosa");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia(toast,"Nombre ya existente");
        get();
      }else if(error.response.status === 500){
        mostrarError(toast,"Error del sistema");
      }
    })
  };
  confirmar1(action);    
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_PlanEstudios(null);
    setclave_UnidadAprendizaje(0);
    setnombre_UnidadAprendizaje("");
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_PlanEstudios', header: 'Plan Estudios', filterHeader: 'Filtro por Plan Estudios' },
    {field: 'clave_UnidadAprendizaje', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'nombre_UnidadAprendizaje', header: 'Nombre', filterHeader: 'Filtro por Nombre'}
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = unidadaprendizajeList.filter((item) => {
      const Acade = planes.find(Acade => Acade.clave_PlanEstudios === item.clave_PlanEstudios)?.nombre_PlanEstudios || '';
        return (
            item.clave_PlanEstudios.toString().includes(value) ||
            item.clave_UnidadAprendizaje.toLowerCase().includes(value) ||
            item.nombre_UnidadAprendizaje.toString().includes(value) ||
            Acade.toLowerCase().includes(value)         
          );
    });
    setfiltrounidadaprendizaje(filteredData);
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
            setclave_PlanEstudios(rowData.clave_PlanEstudios);
            setclave_UnidadAprendizaje(rowData.clave_UnidadAprendizaje);
            setnombre_UnidadAprendizaje(rowData.nombre_UnidadAprendizaje);
            setDatosCopia({
              clave_PlanEstudios: rowData.clave_PlanEstudios,
              clave_UnidadAprendizaje: rowData.clave_UnidadAprendizaje,
              nombre_UnidadAprendizaje: rowData.nombre_UnidadAprendizaje,
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
  };    

  useEffect(() => {
    PlanEstudiosService.consultarPlanestudios()
      .then(response => {
        setplanes(response.data);
      })
      .catch(error => {
        console.error("Error fetching:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_PlanEstudios') {
      const plan = planes.find((plan) => plan.clave_PlanEstudios === rowData.clave_PlanEstudios);
      return plan ? `${plan.nombre_PlanEstudios}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Unidad Aprendizaje</h4>)}
      {abrirDialog===2 && (<h4>Modificar Unidad Aprendizaje</h4>)}
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
    <Toolbar start={<h2 className="m-0">Unidad Aprendizaje</h2>} end={Herramientas}/>
    <ConfirmDialog />
      {/*PANEL PARA EL REGISTRO*/}
      <Dialog className='w-7' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
        <div className="field col-8">
              <label>Plan Estudios*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_PlanEstudios}
              value={clave_PlanEstudios} 
              options={planes} 
              onChange={(e) => {
                setclave_PlanEstudios(e.value);
              }} 
              optionLabel="nombre_PlanEstudios" 
              optionValue="clave_PlanEstudios"
              placeholder="Seleccione un Plan Estudios" 
            />
          </div> 
          <div className="field col-2">
              <label className='font-bold'>Clave*</label>
              <InputText disabled={abrirDialog===2} invalid={enviado===true && !clave_UnidadAprendizaje} type="text" keyfilter="pint" value={clave_UnidadAprendizaje} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {  
                      setclave_UnidadAprendizaje(event.target.value);
                    }
                  }}  
              placeholder="Ej.6"
              className="w-full"/>
          </div>
          <div className="field col-8">
              <label>Nombre*</label>
              <InputText invalid={enviado===true && !nombre_UnidadAprendizaje} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_UnidadAprendizaje} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setnombre_UnidadAprendizaje(event.target.value);
                    }
                  }}  
                  placeholder="Ej. Algoritmos y Estructura de Datos" 
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
        <DataTable 
        onFilter={onFilter} filters={lazyState.filters} filterDisplay="row" 
        scrollable scrollHeight="78vh"
        ref={dt}         
        value={filtrounidadaprendizaje.length ? filtrounidadaprendizaje :unidadaprendizajeList} 
        size='small'>
          {columns.map(({ field, header, filterHeader }) => {
              return <Column style={{minWidth:'40vh'}} bodyStyle={{textAlign:'center'}} sortable filter filterPlaceholder={filterHeader}
              filterMatchModeOptions={[
                { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH },
                { label: 'Contiene', value: FilterMatchMode.CONTAINS },
                { label: 'No contiene', value: FilterMatchMode.NOT_CONTAINS },
                { label: 'Termina con', value: FilterMatchMode.ENDS_WITH },
                { label: 'Igual', value: FilterMatchMode.EQUALS },
                { label: 'No igual', value: FilterMatchMode.NOT_EQUALS },
              ]} 
              key={field} field={field} header={header} body={(rowData) => renderBody(rowData, field)}/>;
          })}
          <Column body={accionesTabla} alignFrozen={'right'} frozen={true}></Column>    
        </DataTable>  
    </>
  )
}

export default UnidadAprendizaje