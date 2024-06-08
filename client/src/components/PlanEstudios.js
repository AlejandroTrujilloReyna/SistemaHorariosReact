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
import { validarTexto, validarNumero} from '../services/ValidacionGlobalService';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import PlanEstudiosService from '../services/PlanEstudiosService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';

const PlanEstudios = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_PlanEstudios,setclave_PlanEstudios] = useState("");
  const [nombre_PlanEstudios,setnombre_PlanEstudios] = useState("");
  const [clave_ProgramaEducativo,setclave_ProgramaEducativo] = useState("");
  const [cant_semestres,setcant_semestres] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [planestudiosList,setplanestudiosList] = useState([]);
  const [filtroplanestudios, setfiltroplanestudios] = useState([]);
  const [programas, setprogramas] = useState([]);
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_PlanEstudios: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        nombre_PlanEstudios: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        clave_ProgramaEducativo: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        cant_semestres: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    },
  });  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    clave_PlanEstudios: "",
    nombre_PlanEstudios: "",
    clave_ProgramaEducativo: "",
    cant_semestres: ""
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
    if (!nombre_PlanEstudios || !clave_ProgramaEducativo || !cant_semestres) {
      mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
      setEnviado(true);
      return;
    }
    const action = () => {
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    PlanEstudiosService.registrarPlanEstudios({
      nombre_PlanEstudios:nombre_PlanEstudios,
      clave_ProgramaEducativo:clave_ProgramaEducativo,
      cant_semestres:cant_semestres,
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
    PlanEstudiosService.consultarPlanestudios().then((response)=>{//CASO EXITOSO
      setplanestudiosList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () =>{
  if (!nombre_PlanEstudios || !clave_ProgramaEducativo || !cant_semestres) {
    mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
    setEnviado(true);
    return;
  }
  if (nombre_PlanEstudios === datosCopia.nombre_PlanEstudios
    && clave_ProgramaEducativo === datosCopia.clave_ProgramaEducativo
    && cant_semestres === datosCopia.cant_semestres){
    mostrarInformacion(toast, "No se han realizado cambios");
    setAbrirDialog(0);
    limpiarCampos();
    return;
  }
  const action = () => {  
  PlanEstudiosService.modificarPlanEstudios({
    clave_PlanEstudios:clave_PlanEstudios,
    nombre_PlanEstudios:nombre_PlanEstudios,
    clave_ProgramaEducativo:clave_ProgramaEducativo,
    cant_semestres:cant_semestres,
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
    setnombre_PlanEstudios("");
    setclave_ProgramaEducativo(null);
    setcant_semestres("");
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_PlanEstudios', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'nombre_PlanEstudios', header: 'Nombre', filterHeader: 'Filtro por Nombre' },
    {field: 'clave_ProgramaEducativo', header: 'Programa Educativo', filterHeader: 'Filtro por Programa Educativo'},
    {field: 'cant_semestres', header: 'Cantidad de semestres', filterHeader: 'Filtro por Semestres'}
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = planestudiosList.filter((item) => {
        return (
            item.clave_PlanEstudios.toString().includes(value) ||
            item.nombre_PlanEstudios.toLowerCase().includes(value) ||
            item.cant_semestres.toString().includes(value) ||
            item.clave_ProgramaEducativo.toString().includes(value)
        );
    });
    setfiltroplanestudios(filteredData);
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
            setnombre_PlanEstudios(rowData.nombre_PlanEstudios);
            setcant_semestres(rowData.cant_semestres);
            setclave_ProgramaEducativo(rowData.clave_ProgramaEducativo);
            setDatosCopia({
              clave_PlanEstudios: rowData.clave_PlanEstudios,
              nombre_PlanEstudios: rowData.nombre_PlanEstudios,
              cant_semestres: rowData.cant_semestres,
              clave_ProgramaEducativo: rowData.clave_ProgramaEducativo
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
  };    

  //MANDAR A LLAMAR A LA LISTA DE UNIDADES ACADEMICAS
  useEffect(() => {
    ProgramaEducativoService.consultarProgramaEducativo()
      .then(response => {
        setprogramas(response.data);
      })
      .catch(error => {
        console.error("Error fetching:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_ProgramaEducativo') {
      const prog = programas.find((prog) => prog.clave_ProgramaEducativo === rowData.clave_ProgramaEducativo);
      return prog ? `${prog.nombre_ProgramaEducativo}` : '';
    }else {
      return rowData[field]; 
    }
  };
  
  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Plan Estudios</h4>)}
      {abrirDialog===2 && (<h4>Modificar Plan Estudios</h4>)}
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
    <Toolbar start={<h2 className="m-0">Plan Estudios</h2>} end={Herramientas}/>
    <ConfirmDialog />
      {/*PANEL PARA EL REGISTRO*/}
      <Dialog className='w-7' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
          <div className="field col-4">
              <label>Nombre*</label>
              <InputText invalid={enviado===true && !nombre_PlanEstudios} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_PlanEstudios} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setnombre_PlanEstudios(event.target.value);
                    }
                  }}  
                  placeholder="Nombre" 
              className="w-full"/>              
          </div>
          <div className="field col-2">
              <label>Cantidad Semestres*</label>
              <InputText invalid={enviado===true && !cant_semestres} type="text" keyfilter="pint" value={cant_semestres} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	setcant_semestres(event.target.value);
                    }
                  }}
                  placeholder="Ej.120"  
              className="w-full"/>
          </div>
          <div className="field col-8">
              <label>Programa Educativo*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_ProgramaEducativo}
              value={clave_ProgramaEducativo} 
              options={programas} 
              onChange={(e) => {
                setclave_ProgramaEducativo(e.value);
              }} 
              optionLabel="nombre_ProgramaEducativo" 
              optionValue="clave_ProgramaEducativo" 
              placeholder="Seleccione un ProgramaEducativo" 
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
        <DataTable 
        onFilter={onFilter} filters={lazyState.filters} filterDisplay="row" 
        scrollable scrollHeight="78vh"
        ref={dt}         
        value={filtroplanestudios.length ? filtroplanestudios :planestudiosList} 
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

export default PlanEstudios