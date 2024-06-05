import React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';//AGREGADO
import { validarTexto, validarNumero} from '../services/ValidacionGlobalService';//AGREGADO
import { Toolbar } from 'primereact/toolbar';//NUEVO
import { Dialog } from 'primereact/dialog';//NUEVO
import { IconField } from 'primereact/iconfield';//NUEVO
import { InputIcon } from 'primereact/inputicon';//NUEVO
import UnidadAcademicaService from '../services/UnidadAcademicaService';
import { FilterMatchMode } from 'primereact/api';

const UnidadAcademica = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_UnidadAcademica,setclave_UnidadAcademica] = useState("");
  const [nombre_UnidadAcademica,setnombre_UnidadAcademica] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [unidadacademicaList,setunidadacademicaList] = useState([]);
  const [filtrounidadacademica, setfiltrounidadacademica] = useState([]);
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_UnidadAcademica: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      nombre_UnidadAcademica: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    },
  });
  //VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
  const [datosCopia, setDatosCopia] = useState({
    clave_UnidadAcademica: "",
    nombre_UnidadAcademica: ""
  });    
  //VARIABLES PARA MANEJAR MENSAJES
  const toast = useRef(null);
  //ESTADOS PARA CONDICIONES
  const [enviado, setEnviado] = useState(false);
  const [abrirDialog,setAbrirDialog] = useState(0);

  //FUNCION PARA REGISTRAR
  const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_UnidadAcademica || !nombre_UnidadAcademica) {
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UnidadAcademicaService.registrarUnidadAcademica({
      clave_UnidadAcademica:clave_UnidadAcademica,
      nombre_UnidadAcademica:nombre_UnidadAcademica
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito(toast,"Registro Exitoso");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia(toast,"Clave ya Existente");
      }else if(error.response.status === 401){
        mostrarAdvertencia(toast,"Nombre ya Existente");
      }else if(error.response.status === 500){
        mostrarError(toast,"Error interno del servidor");
      }     
    });
  }

  //FUNCION PARA LA CONSULTA
  const get = ()=>{
    UnidadAcademicaService.consultarUnidadAcademica().then((response)=>{//CASO EXITOSO
      setunidadacademicaList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () =>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_UnidadAcademica || !nombre_UnidadAcademica) {
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    //VALIDACIONES PARA EL CASO DONDE SE DE CLIC EN GUARDAR PERO NO SE REALICEN CAMBIOS
    if (clave_UnidadAcademica === datosCopia.clave_UnidadAcademica
       && nombre_UnidadAcademica === datosCopia.nombre_UnidadAcademica) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;      
    }
    UnidadAcademicaService.modificarUnidadAcademica({
      clave_UnidadAcademica:clave_UnidadAcademica,
      nombre_UnidadAcademica:nombre_UnidadAcademica
    }).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito(toast,"Modificación Exitosa");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia(toast,"Nombre ya Existente");
        get();
      }else if(error.response.status === 401){
        mostrarError(toast,"Error del sistema");
      }
    });
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_UnidadAcademica("");
    setnombre_UnidadAcademica("");
  }  

  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'clave_UnidadAcademica', header: 'Clave', filterHeader: 'Filtro por Clave' },
    { field: 'nombre_UnidadAcademica', header: 'Nombre', filterHeader: 'Filtro por Nombre' },
  ];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = unidadacademicaList.filter((item) => {
        return (
            item.clave_UnidadAcademica.toString().includes(value) ||
            item.nombre_UnidadAcademica.toLowerCase().includes(value)
        );
    });
    setfiltrounidadacademica(filteredData);
  };

  //BOTON PARA MODIFICAR
  const accionesTabla = (rowData) => {
    return (
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="m-1"
          onClick={() => {
            setclave_UnidadAcademica(rowData.clave_UnidadAcademica);
            setnombre_UnidadAcademica(rowData.nombre_UnidadAcademica);
            setDatosCopia({
              clave_UnidadAcademica: rowData.clave_UnidadAcademica,
              nombre_UnidadAcademica: rowData.nombre_UnidadAcademica
            });
            setAbrirDialog(2);
          }}
        />
    );
  };  
  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      <h4>Registrar Unidad Academica</h4>
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
  
  const Titulo = () =>{
    return(<h2 className="m-0">Unidad Academica</h2>);
  };

    // Funcion Necesaria para filtrado
    const onFilter = (event) => {
      event['first'] = 0;
      setlazyState(event);
    };

  return (
    <>
      <Toast ref={toast} />
      <Toolbar start={Titulo} end={Herramientas}/>
      <Dialog header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
            <div className="field col-2">
                <label className='font-bold'>Clave*</label>
                <InputText disabled={abrirDialog===2} invalid={enviado===true && !clave_UnidadAcademica} type="text" keyfilter="pint" value={clave_UnidadAcademica} maxLength={10}
                  onChange={(event) => {
                    if (validarNumero(event.target.value)) {
                      setclave_UnidadAcademica(event.target.value);
                    }
                  }}
                placeholder="Ej.105"
                className="w-full"/>
            </div>
            <div className="field col-10">
                <label className='font-bold'>Nombre*</label>
                <InputText invalid={enviado===true && !nombre_UnidadAcademica} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_UnidadAcademica} maxLength={255}
                  onChange={(event) => {
                    if (validarTexto(event.target.value)) {
                      setnombre_UnidadAcademica(event.target.value);
                    }
                  }}
                placeholder="Ej.Facultad de Ingeniería Mxl"
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
      <DataTable onFilter={onFilter} filters={lazyState.filters} filterDisplay="row" scrollable scrollHeight="78vh"
      ref={dt} value={filtrounidadacademica.length ? filtrounidadacademica :unidadacademicaList} 
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
              key={field} field={field} header={header}/>;
          })}
          <Column body={accionesTabla} alignFrozen={'right'} frozen={true}></Column>          
      </DataTable>          
    </>
  )
}

export default UnidadAcademica