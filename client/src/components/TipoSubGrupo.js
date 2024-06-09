import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import TipoSubGrupoService from '../services/TipoSubGrupoService';
import { validarTexto} from '../services/ValidacionGlobalService';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';  
import { FilterMatchMode } from 'primereact/api';
const TipoSubGrupo = () => {
    //VARIABLES PARA EL REGISTRO
    const [clave_TipoSubGrupo,setclave_TipoSubGrupo] = useState("");
    const [nombre_TipoSubGrupo,setnombre_TipoSubGrupo] = useState("");

    //VARIABLES PARA LA CONSULTA
    const [tiposubgrupoList,settiposubgrupoList] = useState([]);
    const [filtrotiposubgrupo, setfiltrotiposubgrupo] = useState([]);
    const dt = useRef(null);
    const [lazyState, setlazyState] = useState({
      filters: {
        clave_TipoSubGrupo: { value: '', matchMode: 'startsWith' },
        nombre_TipoSubGrupo: { value: '', matchMode: 'startsWith' }        
      },
    });
    //VARIABLES PARA MANEJAR MENSAJES
    const toast = useRef(null);    
    //VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
    const [datosCopia, setDatosCopia] = useState({
      clave_TipoSubGrupo: "",
      nombre_TipoSubGrupo: ""
    });
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
      if (!nombre_TipoSubGrupo) {
        mostrarAdvertencia(toast, "Existen campos Obligatorios vacíos");
        setEnviado(true);
        return;
      }
      //MANDAR A LLAMAR AL REGISTRO SERVICE
      const action = () => {
        TipoSubGrupoService.registrarTipoSubGrupo({
          nombre_TipoSubGrupo:nombre_TipoSubGrupo,
    
        }).then(response=>{
          if (response.status === 200) {//CASO EXITOSO            
            mostrarExito(toast, "Registro Exitoso");
            get();
            limpiarCampos();
            setEnviado(false);
            setAbrirDialog(0);
          }
        }).catch(error=>{//EXCEPCIONES
          if (error.response.status === 401) {
            mostrarAdvertencia(toast, "Nombre ya Existente");      
          }else if(error.response.status === 500){          
            mostrarError(toast, "Error interno del servidor");
          }     
        });
      };
      confirmar1(action);
    }  
  
    //FUNCION PARA CONSULTA
    const get = ()=>{
      TipoSubGrupoService.consultarTipoSubGrupo().then((response)=>{//CASO EXITOSO
        settiposubgrupoList(response.data);  
      }).catch(error=>{//EXCEPCIONES
        if (error.response.status === 500) {
        }
      });    
    }
  
    //FUNCION PARA LA MODIFICACION
    const put = (rowData) =>{
      if (!clave_TipoSubGrupo || !nombre_TipoSubGrupo) {
        mostrarAdvertencia(toast, "Existen campos obligatorios vacíos");
        setEnviado(true);
        return;
      }
      if (clave_TipoSubGrupo === datosCopia.clave_TipoSubGrupo
        && nombre_TipoSubGrupo === datosCopia.nombre_TipoSubGrupo) {
        mostrarInformacion(toast, "No se han realizado cambios");
        setAbrirDialog(0);
        limpiarCampos();
        return;
      }
      const action = () => {
        TipoSubGrupoService.modificarTipoSubGrupo({
          clave_TipoSubGrupo:clave_TipoSubGrupo,
          nombre_TipoSubGrupo:nombre_TipoSubGrupo
        }).then(response=>{
          if (response.status === 200) {//CASO EXITOSO
            mostrarExito(toast, "Modificación Exitosa");
            get();
            limpiarCampos();
            setEnviado(false);
            setAbrirDialog(0);
          }
        }).catch(error=>{//EXCEPCIONES
          if (error.response.status === 401) {
            mostrarAdvertencia(toast, "Nombre ya Existente");      
          }else if(error.response.status === 500){          
            mostrarError(toast, "Error interno del servidor");
          }     
        });
      };
      confirmar1(action);
    }
    
    //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
    const limpiarCampos = () =>{
      setclave_TipoSubGrupo("");
      setnombre_TipoSubGrupo("");
    }
      
    //COLUMNAS PARA LA TABLA
    const columns = [
      {field: 'clave_TipoSubGrupo', header: 'Clave', filterHeader: 'Filtro por Clave', hidden: true, exportable: true},
      {field: 'nombre_TipoSubGrupo', header: 'Nombre', filterHeader: 'Filtro por Nombre'} 
    ];
    
    //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
    useEffect(() => {
      get();
    }, []);
  
    //FUNCION PARA LA BARRA DE BUSQUEDA
    const onSearch = (e) => {
      const value = e.target.value.toLowerCase();
      const filteredData = tiposubgrupoList.filter((item) => {
          return (
              item.clave_TipoSubGrupo.toString().includes(value) ||
              item.nombre_TipoSubGrupo.toLowerCase().includes(value)    
          );
      });
      setfiltrotiposubgrupo(filteredData);
    };   
    
    //BOTON PARA MODIFICAR Y ELIMINAR
    const accionesTabla = (rowData) => {
      return (<>
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            className="m-1"
            onClick={() => {
              setclave_TipoSubGrupo(rowData.clave_TipoSubGrupo);
              setnombre_TipoSubGrupo(rowData.nombre_TipoSubGrupo);
              setDatosCopia({
                clave_TipoSubGrupo: rowData.clave_TipoSubGrupo,
                nombre_TipoSubGrupo: rowData.nombre_TipoSubGrupo
              });
              setAbrirDialog(2);
            }}          
          />
          {/*<Button
            icon="pi pi-trash"
            severity='danger'
            rounded
            outlined
            className="m-1"
            onClick={() => {
              delet(rowData.clave_UnidadAcademica);
            }}          
          />  */ }     
          </>
      );
    };
  
    const headerTemplate = (
      <div className="formgrid grid justify-content-center border-bottom-1 border-300">
        {abrirDialog===1 && (<h4>Registrar Unidad Academica</h4>)}
        {abrirDialog===2 && (<h4>Modificar Unidad Academica</h4>)}
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
      <Toolbar start={<h2 className="m-0">Unidad Academica</h2>} end={Herramientas}/>
      <ConfirmDialog />
        <Dialog header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
          <div className="formgrid grid justify-content-center">            
            <div className="field col">
                <label className='font-bold'>Nombre*</label>
                <InputText invalid={enviado===true && !nombre_TipoSubGrupo} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_TipoSubGrupo} maxLength={255}
                    onChange={(event)=>{
                      if (validarTexto(event.target.value)) {  
                        setnombre_TipoSubGrupo(event.target.value);
                      }
                    }}  
                    required
                    placeholder="Ej.Taller"
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
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
          scrollable scrollHeight="78vh"
          ref={dt} 
          value={filtrotiposubgrupo.length ? filtrotiposubgrupo :tiposubgrupoList}
          size='small'>
            {columns.map(({ field, header, hidden, filterHeader }) => {                
                return <Column style={hidden ? { display: 'none' } : { minWidth: '40vh' }} bodyStyle={{textAlign:'center'}} sortable filter filterPlaceholder={filterHeader} 
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
  
  export default TipoSubGrupo