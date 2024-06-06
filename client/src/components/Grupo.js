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
import { ToggleButton } from 'primereact/togglebutton';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import { validarTexto, validarNumero} from '../services/ValidacionGlobalService';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import GrupoService from '../services/GrupoService';
import PlanEstudiosService from '../services/PlanEstudiosService';

const Grupo = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_Grupo,setclave_Grupo] = useState("");
  const [nombre_Grupo,setnombre_Grupo] = useState("");
  const [semestre,setsemestre] = useState("");
  const [uso,setuso] = useState(1);
  const [clave_PlanEstudios,setclave_PlanEstudios] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [grupoList,setgrupoList] = useState([]);
  const [filtrogrupo, setfiltrogrupo] = useState([]);
  const [planesestudio, setplanesestudio] = useState([]);
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
        clave_Grupo: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        nombre_Grupo: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        semestre: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        uso: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
        clave_PlanEstudios: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    },
  });  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    clave_Grupo: "",
    nombre_Grupo: "",
    semestre: "",
    uso: 0,
    clave_PlanEstudios: ""
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
    if (!clave_PlanEstudios || !clave_Grupo || !nombre_Grupo || !semestre) {
      mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
      setEnviado(true);
      return;
    }
    const action = () => {
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    GrupoService.registrarGrupo({
      clave_Grupo:clave_Grupo,
      nombre_Grupo:nombre_Grupo,
      semestre:semestre,
      uso:uso,
      clave_PlanEstudios:clave_PlanEstudios      
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
    GrupoService.consultarGrupo().then((response)=>{//CASO EXITOSO
      setgrupoList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () =>{
  if (!clave_PlanEstudios || !nombre_Grupo || !semestre || !uso || !clave_Grupo) {
    mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
    setEnviado(true);
    return;
  }
  if (clave_PlanEstudios === datosCopia.clave_PlanEstudios
    && clave_Grupo === datosCopia.clave_Grupo
    && semestre === datosCopia.semestre
    && uso === datosCopia.uso
    && nombre_Grupo === datosCopia.nombre_Grupo) {
    mostrarInformacion(toast, "No se han realizado cambios");
    setAbrirDialog(0);
    limpiarCampos();
    return;
  }
  const action = () => {  
  GrupoService.modificarGrupo({
    clave_Grupo:clave_Grupo,
    nombre_Grupo:nombre_Grupo,
    semestre:semestre,
    uso:uso,
    clave_PlanEstudios:clave_PlanEstudios        
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
    setclave_Grupo("");
    setnombre_Grupo("");
    setsemestre("");
    setuso(1);
    setclave_PlanEstudios(null);
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_Grupo', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'nombre_Grupo', header: 'Nombre', filterHeader: 'Filtro por Nombre' },
    {field: 'semestre', header: 'semestre', filterHeader: 'Filtro por Semestre'},
    {field: 'uso', header: 'Uso', filterHeader: 'Filtro por Uso'},
    {field: 'clave_PlanEstudios', header: 'Plan de Estudios',filterHeader: 'Filtro por Plan de Estudios'}    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = grupoList.filter((item) => {
        return (
            item.clave_PlanEstudios.toString().includes(value) ||
            item.clave_Grupo.toString().includes(value) ||
            item.nombre_Grupo.toLowerCase().includes(value) ||
            item.semestre.toString().includes(value) ||
            item.uso.toString().includes(value)            
        );
    });
    setfiltrogrupo(filteredData);
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
            setclave_Grupo(rowData.clave_Grupo);
            setnombre_Grupo(rowData.nombre_Grupo);
            setsemestre(rowData.semestre);
            setuso(rowData.uso);
            setclave_PlanEstudios(rowData.clave_PlanEstudios);
            setDatosCopia({
                clave_Grupo: rowData.clave_Grupo,
                nombre_Grupo: rowData.nombre_Grupo,
                semestre: rowData.semestre,
                uso: rowData.uso,
                clave_PlanEstudios: rowData.clave_PlanEstudios
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
  };    

  //MANDAR A LLAMAR A LA LISTA DE UNIDADES ACADEMICAS
  useEffect(() => {
    PlanEstudiosService.consultarPlanestudios()
      .then(response => {
        setplanesestudio(response.data);
      })
      .catch(error => {
        console.error("Error fetching planes educativos:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_PlanEstudios') {
      const plan = planesestudio.find((plan) => plan.clave_PlanEstudios === rowData.clave_PlanEstudios);
      return plan ? `${plan.nombre_PlanEstudios}` : '';
    }else {
      return rowData[field]; 
    }
  };
  
  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Grupo</h4>)}
      {abrirDialog===2 && (<h4>Modificar Grupo</h4>)}
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
    <Toolbar start={<h2 className="m-0">Grupo</h2>} end={Herramientas}/>
    <ConfirmDialog />
      {/*PANEL PARA EL REGISTRO*/}
      <Dialog className='w-7' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
          <div className="field col-2">
              <label className='font-bold'>Clave*</label>
              <InputText disabled={abrirDialog===2} invalid={enviado===true && !clave_Grupo} type="text" keyfilter="pint" value={clave_Grupo} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {  
                      setclave_Grupo(event.target.value);
                    }
                  }}  
              placeholder="Ej.100"
              className="w-full"/>
          </div>
          <div className="field col-4">
              <label>Nombre*</label>
              <InputText invalid={enviado===true && !nombre_Grupo} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_Grupo} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setnombre_Grupo(event.target.value);
                    }
                  }}  
                  placeholder="Nombre" 
              className="w-full"/>              
          </div>
          <div className="field col-2">
              <label>Semestre*</label>
              <InputText invalid={enviado===true && !semestre} type="text" keyfilter="pint" value={semestre} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	setsemestre(event.target.value);
                    }
                  }}
                  placeholder="Ej.120"  
              className="w-full"/>
          </div>
          <div className="field col-2">
              <label>Uso*</label>
              <ToggleButton
                onLabel="Si"
                onIcon="pi pi-check" 
                offIcon="pi pi-times" 
                checked={uso === 1} 
                onChange={(e) => setuso(e.value ? 1 : 0)} 
                className="w-8rem" 
            />
          </div>
          <div className="field col-8">
              <label>Plan Estudios*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_PlanEstudios}
              value={clave_PlanEstudios} 
              options={planesestudio} 
              onChange={(e) => {
                setclave_PlanEstudios(e.value);
              }} 
              optionLabel="nombre_PlanEstudios" 
              optionValue="clave_PlanEstudios" 
              placeholder="Seleccione un Plan de Estudios" 
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
        value={filtrogrupo.length ? filtrogrupo :grupoList} 
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

export default Grupo