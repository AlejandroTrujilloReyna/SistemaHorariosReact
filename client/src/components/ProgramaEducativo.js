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
import ProgramaEducativoService from '../services/ProgramaEducativoService';
import UnidadAcademicaService from '../services/UnidadAcademicaService';

const ProgramaEducativo = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_ProgramaEducativo,setclave_ProgramaEducativo] = useState("");
  const [nombre_ProgramaEducativo,setnombre_ProgramaEducativo] = useState("");
  const [banco_Horas,setbanco_Horas] = useState("");
  const [asignaturas_horas,setasignaturas_horas] = useState(0);
  const [clave_UnidadAcademica,setclave_UnidadAcademica] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [programaeducativoList,setprogramaeducativoList] = useState([]);
  const [filtroprogramaeducativo, setfiltroprogramaeducativo] = useState([]);
  const [unidadesAcademicas, setUnidadesAcademicas] = useState([]);
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_ProgramaEducativo: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      nombre_ProgramaEducativo: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      banco_Horas: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      asignaturas_horas: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_UnidadAcademica: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    },
  });  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    clave_ProgramaEducativo: "",
    nombre_ProgramaEducativo: "",
    banco_Horas: "",
    asignaturas_horas: 0,
    clave_UnidadAcademica: ""
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
    if (!clave_UnidadAcademica || !clave_ProgramaEducativo || !nombre_ProgramaEducativo) {
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    const action = () => {
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    ProgramaEducativoService.registrarProgramaEducativo({
      clave_ProgramaEducativo:clave_ProgramaEducativo,
      nombre_ProgramaEducativo:nombre_ProgramaEducativo,
      //VALIDACION PARA EL CAMPO NUMERICO NO OBLIGATORIO BANCO DE HORAS
      banco_Horas:banco_Horas.trim !== '' ? banco_Horas : 0,
      asignaturas_horas:asignaturas_horas,
      clave_UnidadAcademica:clave_UnidadAcademica      
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
        mostrarAdvertencia(toast,"Nombre ya existente en la misma Unidad Académica ");      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }     
    });    
    };
    confirmar1(action);
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    ProgramaEducativoService.consultarProgramaEducativo().then((response)=>{//CASO EXITOSO
      setprogramaeducativoList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () =>{
  if (!clave_UnidadAcademica || !clave_ProgramaEducativo || !nombre_ProgramaEducativo) {
    mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
    setEnviado(true);
    return;
  }
  if (clave_UnidadAcademica === datosCopia.clave_UnidadAcademica
    && clave_ProgramaEducativo === datosCopia.clave_ProgramaEducativo
    && banco_Horas === datosCopia.banco_Horas
    && asignaturas_horas === datosCopia.asignaturas_horas
    && nombre_ProgramaEducativo === datosCopia.nombre_ProgramaEducativo) {
    mostrarInformacion(toast, "No se han realizado cambios");
    setAbrirDialog(0);
    limpiarCampos();
    return;
  }
  const action = () => {  
  ProgramaEducativoService.modificarProgramaEducativo({
    clave_ProgramaEducativo:clave_ProgramaEducativo,
    nombre_ProgramaEducativo:nombre_ProgramaEducativo,
    //VALIDACION PARA EL CAMPO NUMERICO NO OBLIGATORIO BANCO DE HORAS
    banco_Horas:banco_Horas.trim !== '' ? banco_Horas : 0,
    asignaturas_horas:asignaturas_horas,
    clave_UnidadAcademica:clave_UnidadAcademica        
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
        mostrarAdvertencia(toast,"Nombre del Programa Educativo ya existente en la Unidad Académica");
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
    setclave_ProgramaEducativo("");
    setnombre_ProgramaEducativo("");
    setbanco_Horas("");
    setasignaturas_horas(0);
    setclave_UnidadAcademica(null);
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_ProgramaEducativo', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'nombre_ProgramaEducativo', header: 'Nombre', filterHeader: 'Filtro por Nombre' },
    {field: 'banco_Horas', header: 'Banco de Horas', filterHeader: 'Filtro por Banco de Horas'},
    {field: 'clave_UnidadAcademica', header: 'Unidad Académica',filterHeader: 'Filtro por Unidad Académica'}    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = programaeducativoList.filter((item) => {
      const Acade = unidadesAcademicas.find(Acade => Acade.clave_UnidadAcademica === item.clave_UnidadAcademica)?.nombre_UnidadAcademica || '';
        return (
            item.clave_ProgramaEducativo.toString().includes(value) ||
            item.nombre_ProgramaEducativo.toLowerCase().includes(value) ||
            item.asignaturas_horas.toString().includes(value) ||
            item.banco_Horas.toString().includes(value)    ||
            Acade.toLowerCase().includes(value)         
        );
    });
    setfiltroprogramaeducativo(filteredData);
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
            setclave_ProgramaEducativo(rowData.clave_ProgramaEducativo);
            setnombre_ProgramaEducativo(rowData.nombre_ProgramaEducativo);
            setbanco_Horas(rowData.banco_Horas);
            setasignaturas_horas(rowData.asignaturas_horas);
            setclave_UnidadAcademica(rowData.clave_UnidadAcademica);
            setDatosCopia({
              clave_ProgramaEducativo: rowData.clave_ProgramaEducativo,
              nombre_ProgramaEducativo: rowData.nombre_ProgramaEducativo,
              banco_Horas: rowData.banco_Horas,
              asignaturas_horas: rowData.asignaturas_horas,
              clave_UnidadAcademica: rowData.clave_UnidadAcademica
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
  };    

  //MANDAR A LLAMAR A LA LISTA DE UNIDADES ACADEMICAS
  useEffect(() => {
    UnidadAcademicaService.consultarUnidadAcademica()
      .then(response => {
        setUnidadesAcademicas(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_UnidadAcademica') {
      const unidad = unidadesAcademicas.find((unidad) => unidad.clave_UnidadAcademica === rowData.clave_UnidadAcademica);
      return unidad ? `${unidad.nombre_UnidadAcademica}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Programa Educativo</h4>)}
      {abrirDialog===2 && (<h4>Modificar Programa Educativo</h4>)}
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
    <Toolbar start={<h2 className="m-0">Programa Educativo</h2>} end={Herramientas}/>
    <ConfirmDialog />
      {/*PANEL PARA EL REGISTRO*/}
      <Dialog className='w-7' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
        <div className="field col-8">
              <label>Unidad Académica*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_UnidadAcademica}
              value={clave_UnidadAcademica} 
              options={unidadesAcademicas} 
              onChange={(e) => {
                setclave_UnidadAcademica(e.value);
              }} 
              optionLabel="nombre_UnidadAcademica" 
              optionValue="clave_UnidadAcademica" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una Unidad Académica" 
            />
          </div> 
          <div className="field col-2">
              <label className='font-bold'>Clave*</label>
              <InputText disabled={abrirDialog===2} invalid={enviado===true && !clave_ProgramaEducativo} type="text" keyfilter="pint" value={clave_ProgramaEducativo} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {  
                      setclave_ProgramaEducativo(event.target.value);
                    }
                  }}  
              placeholder="Ej.6"
              className="w-full"/>
          </div>
          <div className="field col-8">
              <label>Nombre*</label>
              <InputText invalid={enviado===true && !nombre_ProgramaEducativo} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_ProgramaEducativo} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setnombre_ProgramaEducativo(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Licenciatura en Sistemas" 
              className="w-full"/>              
          </div>
          <div className="field col-2">
              <label>Banco de horas</label>
              <InputText invalid={enviado===true && !banco_Horas} type="text" keyfilter="pint" value={banco_Horas} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	setbanco_Horas(event.target.value);
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
        value={filtroprogramaeducativo.length ? filtroprogramaeducativo :programaeducativoList} 
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

export default ProgramaEducativo