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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';//NUEVO
import TipoEmpleadoService from '../services/TipoEmpleadoService';
import { FilterMatchMode } from 'primereact/api';


const TipoEmpleado = () => {
    const [clave_TipoEmpleado,setclave_TipoEmpleado] = useState(0);
    const [nombre_TipoEmpleado,setnombre_TipoEmpleado] = useState("");
    const [horas_MinimasTipoEmpleado,sethoras_MinimasTipoEmpleado] = useState("");
    const [horas_MaximasTipoEmpleado,sethoras_MaximasTipoEmpleado] = useState("");
  
    const [tipoempleadolist,settipoempleadolist] = useState([]);
    const [filtrotipoempleado,setfiltrotipoempleado] = useState([]);
  
    const dt = useRef(null);
    //INICIALIZACION DE FILTROS
    const [lazyState, setlazyState] = useState({
      filters: {
        clave_TipoEmpleado: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        nombre_TipoEmpleado: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        horas_MinimasTipoEmpleado: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        horas_MaximasTipoEmpleado: { value: '', matchMode: FilterMatchMode.STARTS_WITH }
      },
    });
  //VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
  const [datosCopia, setDatosCopia] = useState({
    clave_TipoEmpleado: "",
    nombre_TipoEmpleado: "",
    horas_MinimasTipoEmpleado:"",
    horas_MaximasTipoEmpleado:""
  });   
  //VARIABLES PARA MANEJAR MENSAJES
  const toast = useRef(null);
  //ESTADOs PARA LAS CONDICIONES
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
    if (!nombre_TipoEmpleado || !horas_MinimasTipoEmpleado || !horas_MaximasTipoEmpleado) {
      mostrarAdvertencia(toast, "Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    const action = () => {
      TipoEmpleadoService.registrarTipoEmpleado({
        nombre_TipoEmpleado: nombre_TipoEmpleado,
        horas_MinimasTipoEmpleado: horas_MinimasTipoEmpleado,
        horas_MaximasTipoEmpleado: horas_MaximasTipoEmpleado

      }).then(response => {
        if (response.status === 200) {
          mostrarExito(toast, "Registro Exitoso");
          get();
          limpiarCampos();
          setEnviado(false);
          setAbrirDialog(0);
        }
      }).catch(error => {
       if (error.response.status === 401) {
          mostrarAdvertencia(toast, "Nombre ya Existente");
        } else if (error.response.status === 403) {
          mostrarAdvertencia(toast, "Error en la horas");
        } else if (error.response.status === 500) {
          mostrarError(toast, "Error interno del servidor");
        }
      });
    };
    confirmar1(action);
  }

  //FUNCION PARA LA CONSULTA
  const get = ()=>{
    TipoEmpleadoService.consultarTipoEmpleado().then((response)=>{//CASO EXITOSO
        settipoempleadolist(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }


 //FUNCION PARA LA MODIFICACION
 const put = () => {
  if (!clave_TipoEmpleado || !nombre_TipoEmpleado || !horas_MinimasTipoEmpleado || !horas_MaximasTipoEmpleado) {
    mostrarAdvertencia(toast, "Existen campos obligatorios vacíos");
    setEnviado(true);
    return;
  }
  if (clave_TipoEmpleado === datosCopia.clave_TipoEmpleado
    && nombre_TipoEmpleado === datosCopia.nombre_TipoEmpleado
    && horas_MinimasTipoEmpleado === datosCopia.horas_MinimasTipoEmpleado
    && horas_MaximasTipoEmpleado === datosCopia.horas_MaximasTipoEmpleado) {
    mostrarInformacion(toast, "No se han realizado cambios");
    setAbrirDialog(0);
    limpiarCampos();
    return;
  }
  const action = () => {
  TipoEmpleadoService.modificarTipoEmpleado({
    clave_TipoEmpleado: clave_TipoEmpleado,
    nombre_TipoEmpleado: nombre_TipoEmpleado,
    horas_MinimasTipoEmpleado: horas_MinimasTipoEmpleado,
    horas_MaximasTipoEmpleado: horas_MaximasTipoEmpleado

  }).then(response => {
    if (response.status === 200) {
      mostrarExito(toast, "Modificación Exitosa");
      get();
      limpiarCampos();
      setEnviado(false);
      setAbrirDialog(0);
    }
  }).catch(error => {
    if (error.response.status === 401) {
      mostrarAdvertencia(toast, "Nombre ya Existente");
      get();
    } else if (error.response.status === 403) {
      mostrarAdvertencia(toast, "Error en la horas");
    }  else if (error.response.status === 500) {
      mostrarError(toast, "Error del sistema");
    }
  });
};
confirmar1(action);
};



//!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
  
    setnombre_TipoEmpleado("")
    sethoras_MinimasTipoEmpleado("");
    sethoras_MaximasTipoEmpleado("")
  } 

   //COLUMNAS PARA LA TABLA
   const columns = [
    { field: 'clave_TipoEmpleado', header: 'Clave', filterHeader: 'Filtro por Clave' },
    { field: 'nombre_TipoEmpleado', header: 'Nombre',  filterHeader: 'Filtro por Nombre' },
    {field: 'horas_MinimasTipoEmpleado', header: 'Horas Mínimas',  filterHeader: 'Filtro por Horas Minimas'},
    {field: 'horas_MaximasTipoEmpleado', header: 'Horas Máximas',  filterHeader: 'Filtro por Horas Maximas'}  
];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);  
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = tipoempleadolist.filter((item) => {
        return (
            item.clave_TipoEmpleado.toString().includes(value) ||          
            item.nombre_TipoEmpleado.toLowerCase().includes(value) ||
            item.horas_MinimasTipoEmpleado.toString().includes(value) ||
            item.horas_MaximasTipoEmpleado.toString().includes(value) 
                    
        )
    });
    setfiltrotipoempleado(filteredData);
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
            setclave_TipoEmpleado(rowData.clave_TipoEmpleado);
            setnombre_TipoEmpleado(rowData.nombre_TipoEmpleado);
            sethoras_MinimasTipoEmpleado(rowData.horas_MinimasTipoEmpleado);
            sethoras_MaximasTipoEmpleado(rowData.horas_MaximasTipoEmpleado);
            setDatosCopia({
              clave_TipoEmpleado: rowData.clave_TipoEmpleado,
              nombre_TipoEmpleado: rowData.nombre_TipoEmpleado,
              horas_MinimasTipoEmpleado: rowData.horas_MinimasTipoEmpleado,
              horas_MaximasTipoEmpleado: rowData.horas_MaximasTipoEmpleado
            });
            setAbrirDialog(2);
          }}          
        />
             
        </>
    );
  };  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Tipo de Empleado</h4>)}
      {abrirDialog===2 && (<h4>Modificar Tipo de Empleado</h4>)}
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
      <Toolbar start={<h2 className="m-0">Tipo de Empleado</h2>} end={Herramientas}/>
      <ConfirmDialog />
      <Dialog header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">          
            <div className="field col-6">
                <label className='font-bold'>Nombre*</label>
                <InputText invalid={enviado===true && !nombre_TipoEmpleado} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_TipoEmpleado} maxLength={255}
                  onChange={(event) => {
                    if (validarTexto(event.target.value)) {
                      setnombre_TipoEmpleado(event.target.value);
                    }
                  }}
                placeholder="Ej.Tiempo Completo"
                className="w-full"/>              
            </div>   
            <div className="field col-2">
              <label className='font-bold'>Horas Minimas</label>
              <InputText invalid={enviado===true && !horas_MinimasTipoEmpleado} type="int" keyfilter="pint" value={horas_MinimasTipoEmpleado} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	sethoras_MinimasTipoEmpleado(event.target.value);
                    }
                  }}
                  placeholder="Ej.120"  
              className="w-full"/>
          </div>
          <div className="field col-2">
              <label className='font-bold'>Horas Maximas</label>
              <InputText invalid={enviado===true && !horas_MaximasTipoEmpleado} type="text" keyfilter="pint" value={horas_MaximasTipoEmpleado} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	sethoras_MaximasTipoEmpleado(event.target.value);
                    }
                  }}
                  placeholder="Ej.120"  
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
      value={filtrotipoempleado.length ? filtrotipoempleado :tipoempleadolist} 
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

export default TipoEmpleado