import React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import { validarTexto, validarNumero} from '../services/ValidacionGlobalService';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import GradoEstudioService from '../services/GradoEstudioService';
import { FilterMatchMode } from 'primereact/api';

const GradoEstudio = () => {
  //VARIABLES PARA EL REGISTRO  
  const [clave_GradoEstudio,setclave_GradoEstudio] = useState("");  
  const [nombre_GradoEstudio,setnombre_GradoEstudio] = useState("");
  const [horas_MinimasGradoEstudio,sethoras_MinimasGradoEstudio] = useState("");
  const [horas_MaximasGradoEstudio,sethoras_MaximasGradoEstudio] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [gradoestudiolist,setgradoestudiolist] = useState([]);
  const [filtrogradoestudio,setfiltrogradoestudio] = useState([]);
  

  const dt = useRef(null);
  //INICIALIZACION DE FILTROS
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_GradoEstudio: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      nombre_GradoEstudio: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      horas_MinimasGradoEstudio: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      horas_MaximasGradoEstudio: { value: '', matchMode: FilterMatchMode.STARTS_WITH }
    },
  });
//VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
const [datosCopia, setDatosCopia] = useState({
  clave_GradoEstudio: "",
  nombre_GradoEstudio: "",
  horas_MinimasGradoEstudio:"",
  horas_MaximasGradoEstudio:""
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
    if (!nombre_GradoEstudio || !horas_MinimasGradoEstudio || !horas_MaximasGradoEstudio) {
      mostrarAdvertencia(toast, "Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    const action = () => {
      GradoEstudioService.registrarGradoEstudio({
        nombre_GradoEstudio: nombre_GradoEstudio,
        horas_MinimasGradoEstudio: horas_MinimasGradoEstudio,
        horas_MaximasGradoEstudio: horas_MaximasGradoEstudio

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
  GradoEstudioService.consultarGradoEstudio().then((response)=>{//CASO EXITOSO
      setgradoestudiolist(response.data);  
  }).catch(error=>{//EXCEPCIONES
    if (error.response.status === 500) {
      //setmensajeError("Error del sistema");
    }
  });    
}

 //FUNCION PARA LA MODIFICACION
 const put = () => {
  if (!clave_GradoEstudio || !nombre_GradoEstudio || !horas_MinimasGradoEstudio || !horas_MaximasGradoEstudio) {
    mostrarAdvertencia(toast, "Existen campos obligatorios vacíos");
    setEnviado(true);
    return;
  }
  if (clave_GradoEstudio === datosCopia.clave_GradoEstudio
    && nombre_GradoEstudio === datosCopia.nombre_GradoEstudio
    && horas_MinimasGradoEstudio === datosCopia.horas_MinimasGradoEstudio
    && horas_MaximasGradoEstudio === datosCopia.horas_MaximasGradoEstudio) {
    mostrarInformacion(toast, "No se han realizado cambios");
    setAbrirDialog(0);
    limpiarCampos();
    return;
  }
  const action = () => {
  GradoEstudioService.modificarGradoEstudio({
    clave_GradoEstudio: clave_GradoEstudio,
    nombre_GradoEstudio: nombre_GradoEstudio,
    horas_MinimasGradoEstudio: horas_MinimasGradoEstudio,
    horas_MaximasGradoEstudio: horas_MaximasGradoEstudio

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
    setnombre_GradoEstudio("")
    sethoras_MinimasGradoEstudio(0);
    sethoras_MaximasGradoEstudio(0)
  } 

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'clave_GradoEstudio', header: 'Clave', filterHeader: 'Filtro por Clave' },
    { field: 'nombre_GradoEstudio', header: 'Nombre', filterHeader: 'Filtro por Nombre' },
    {field: 'horas_MinimasGradoEstudio', header: 'Hora Mínimas', filterHeader: 'Filtro por Horas Mínimas'},
    {field: 'horas_MaximasGradoEstudio', header: 'Hora Máximas', filterHeader: 'Filtro por Horas Maximas'}  
  ];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);  
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = gradoestudiolist.filter((item) => {
        return (
            item.clave_GradoEstudio.toString().includes(value) ||          
            item.nombre_GradoEstudio.toLowerCase().includes(value) ||
            item.horas_MinimasGradoEstudio.toString().includes(value) ||
            item.horas_MaximasGradoEstudio.toString().includes(value) 
                    
        )
    });
    setfiltrogradoestudio(filteredData);
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
            setclave_GradoEstudio(rowData.clave_GradoEstudio);
            setnombre_GradoEstudio(rowData.nombre_GradoEstudio);
            sethoras_MinimasGradoEstudio(rowData.horas_MinimasGradoEstudio);
            sethoras_MaximasGradoEstudio(rowData.horas_MaximasGradoEstudio);
            setDatosCopia({
              clave_GradoEstudio: rowData.clave_GradoEstudio,
              nombre_GradoEstudio: rowData.nombre_GradoEstudio,
              horas_MinimasGradoEstudio: rowData.horas_MinimasGradoEstudio,
              horas_MaximasGradoEstudio: rowData.horas_MaximasGradoEstudio
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
      {abrirDialog===1 && (<h4>Registrar Grado de Estudios</h4>)}
      {abrirDialog===2 && (<h4>Modificar Grado de Estudios</h4>)}
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
      <Toolbar start={<h2 className="m-0">Grado de Estudios</h2>} end={Herramientas}/>
      <ConfirmDialog />
      <Dialog header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">          
            <div className="field col-6">
                <label className='font-bold'>Nombre*</label>
                <InputText invalid={enviado===true && !nombre_GradoEstudio} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_GradoEstudio} maxLength={255}
                  onChange={(event) => {
                    if (validarTexto(event.target.value)) {
                      setnombre_GradoEstudio(event.target.value);
                    }
                  }}
                placeholder="Ej.Doctorado"
                className="w-full"/>              
            </div>   
            <div className="field col-2">
              <label className='font-bold'>Horas Minimas</label>
              <InputText invalid={enviado===true && !horas_MinimasGradoEstudio} type="int" keyfilter="pint" value={horas_MinimasGradoEstudio} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	sethoras_MinimasGradoEstudio(event.target.value);
                    }
                  }}
                  placeholder="Ej.12"  
              className="w-full"/>
          </div>
          <div className="field col-2">
              <label className='font-bold'>Horas Maximas</label>
              <InputText invalid={enviado===true && !horas_MaximasGradoEstudio} type="text" keyfilter="pint" value={horas_MaximasGradoEstudio} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	sethoras_MaximasGradoEstudio(event.target.value);
                    }
                  }}
                  placeholder="Ej.16"  
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
      value={filtrogradoestudio.length ? filtrogradoestudio :gradoestudiolist} 
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

export default GradoEstudio
