import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import { validarTexto} from '../services/ValidacionGlobalService';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import MaterialService from '../services/MaterialService';

const Material = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_Material,setclave_Material] = useState("");
  const [nombre_Material,setnombre_Material] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [materialList,setmaterialList] = useState([]);
  const [filtromaterial, setfiltromaterial] = useState([]);
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
        clave_Material: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        nombre_Material: { value: '', matchMode: FilterMatchMode.STARTS_WITH }
      },
  });  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    clave_Material:"",
    nombre_Material: "",
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
    if (!nombre_Material) {
      mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
      setEnviado(true);
      return;
    }
    const action = () => {
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    MaterialService.registrarMaterial({
      nombre_Material:nombre_Material,
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
        mostrarAdvertencia(toast,"Nombre ya Existente");      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }     
    });    
    };
    confirmar1(action);
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    MaterialService.consultarMaterial().then((response)=>{//CASO EXITOSO
      setmaterialList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () =>{
  if (!nombre_Material) {
    mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
    setEnviado(true);
    return;
  }
  if (nombre_Material === datosCopia.nombre_Material) {
    mostrarInformacion(toast, "No se han realizado cambios");
    setAbrirDialog(0);
    limpiarCampos();
    return;
  }
  const action = () => {  
  MaterialService.modificarMaterial({
    clave_Material:clave_Material,
    nombre_Material:nombre_Material,
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
        mostrarAdvertencia(toast,"Nombre ya Existente");
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
    setnombre_Material("");
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_Material', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'nombre_Material', header: 'Nombre', filterHeader: 'Filtro por Nombre' },    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = materialList.filter((item) => {
        return (
            item.nombre_Material.toLowerCase().includes(value)          
        );
    });
    setfiltromaterial(filteredData);
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
            setclave_Material(rowData.clave_Material);
            setnombre_Material(rowData.nombre_Material);
            setDatosCopia({
                clave_Material: rowData.clave_Material,
                nombre_Material: rowData.nombre_Material
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
  };    

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
      return rowData[field]; 
  };
  
  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Material</h4>)}
      {abrirDialog===2 && (<h4>Modificar Material</h4>)}
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
    <Toolbar start={<h2 className="m-0">Material</h2>} end={Herramientas}/>
    <ConfirmDialog />
      {/*PANEL PARA EL REGISTRO*/}
      <Dialog className='w-2' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
          <div className="field col-12">
              <label className='font-bold'>Nombre*</label>
              <InputText invalid={enviado===true && !nombre_Material} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_Material} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setnombre_Material(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Cañon" 
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
        value={filtromaterial.length ? filtromaterial :materialList} 
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

export default Material