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
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import UsuarioService from '../services/UsuarioService';
import PermisoService from '../services/PermisoService';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import { validarTexto,validarCorreo } from '../services/ValidacionGlobalService';
import { FilterMatchMode } from 'primereact/api';

const Usuario = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_Usuario,setclave_Usuario] = useState("");
  const [nombre_Usuario,setnombre_Usuario] = useState("");
  const [apellidoP_Usuario,setapellidoP_Usuario] = useState("");
  const [apellidoM_Usuario,setapellidoM_Usuario] = useState("");
  const [correo, setcorreo] = useState("");
  const [contrasena, setcontrasena] = useState("");
  const [clave_Permiso, setclave_Permiso] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [usuariosList,setusuariosList] = useState([]);
  const [filtroUsuario, setfiltroUsuario] = useState([]);
  const [permisos, setPermisos] = useState([]);  
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_Usuario: { value: '', matchMode: FilterMatchMode.STARTS_WITH }, 
      nombre_Usuario: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      apellidoP_Usuario: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      apellidoM_Usuario: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      correo: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      contrasena: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_Permiso: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    },
  });  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    nombre_Usuario: "",
    apellidoP_Usuario: "",
    apellidoM_Usuario: "",
    correo: "",
    contrasena: "",
    clave_Permiso: ""
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
    if (!nombre_Usuario || !apellidoP_Usuario || !apellidoM_Usuario || !correo || !contrasena || !clave_Permiso) {
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    const action = () => {
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UsuarioService.registrarUsuario({
      nombre_Usuario:nombre_Usuario,
      apellidoP_Usuario:apellidoP_Usuario,
      apellidoM_Usuario:apellidoM_Usuario,
      correo:correo,
      contrasena:contrasena,
      clave_Permiso:clave_Permiso    
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito(toast,"Registro Exitoso");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia(toast,"Correo ya existente ");      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }     
    });    
    };
    confirmar1(action);
  }  
  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    UsuarioService.consultarUsuario().then((response)=>{//CASO EXITOSO
      setusuariosList(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

 
  //FUNCION PARA LA MODIFICACION
  const put = () =>{
  if (!nombre_Usuario || !apellidoP_Usuario || !apellidoM_Usuario || !correo || !contrasena || !clave_Permiso) {
    mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
    setEnviado(true);
    return;
  }
  if (clave_Usuario === datosCopia.clave_Usuario
    && nombre_Usuario === datosCopia.nombre_Usuario
    && apellidoP_Usuario === datosCopia.apellidoP_Usuario
    && apellidoM_Usuario === datosCopia.apellidoM_Usuario
    && correo === datosCopia.correo
    && contrasena === datosCopia.contrasena
    && clave_Permiso === datosCopia.clave_Permiso) {
    mostrarInformacion(toast, "No se han realizado cambios");
    setAbrirDialog(0);
    limpiarCampos();
    return;
  }
  const action = () => {  
  UsuarioService.modificarUsuario({
    clave_Usuario:clave_Usuario,
    nombre_Usuario:nombre_Usuario,
      apellidoP_Usuario:apellidoP_Usuario,
      apellidoM_Usuario: apellidoM_Usuario,
      correo: correo,
      contrasena: contrasena,
      clave_Permiso:clave_Permiso       
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
        mostrarAdvertencia(toast,"El Correo ya Existe");
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
    setnombre_Usuario("");
    setapellidoP_Usuario("");
    setapellidoM_Usuario("");
    setcorreo("");
    setcontrasena("");
    setclave_Permiso(null);
  } 

  //!!!EXTRAS DE CONSULTA
  
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_Usuario', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'correo', header: 'Correo', filterHeader: 'Filtro por Correo' },
    {field: 'contrasena', header: 'Contraseña', filterHeader: 'Filtro por Contraseña' },
    {field: 'clave_Permiso', header: 'Permiso', filterHeader: 'Filtro por Permiso' },
    {field: 'nombre_Usuario', header: 'Nombre' , filterHeader: 'Filtro por Nombre'},
    {field: 'apellidoP_Usuario', header: 'Apellido P', filterHeader: 'Filtro por Apellido Paterno' },
    {field: 'apellidoM_Usuario', header: 'Apellido M', filterHeader: 'Filtro por Apellido Materno' }          
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  },[]);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = usuariosList.filter((item) => {
    const clave_permiso = item.clave_ProgramaEducativo ? item.clave_ProgramaEducativo.toString() : '';    
    const nombrePermiso = permisos.find(per => per.clave_Permiso === item.clave_Permiso)?.nombre_Permiso || '';    
        return (
            item.clave_Usuario.toString().includes(value) ||
            item.correo.toLowerCase().includes(value) ||            
            item.nombre_Usuario.toLowerCase().includes(value) ||
            item.apellidoP_Usuario.toLowerCase().includes(value) ||
            item.apellidoM_Usuario.toLowerCase().includes(value) ||
            clave_permiso.toString().includes(value) ||
            nombrePermiso.toLowerCase().includes(value)           
        );
    });
    setfiltroUsuario(filteredData);
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
          setclave_Usuario(rowData.clave_Usuario);
          setnombre_Usuario(rowData.nombre_Usuario);
          setapellidoP_Usuario(rowData.apellidoP_Usuario);
          setapellidoM_Usuario(rowData.apellidoM_Usuario);
          setcorreo(rowData.correo);
          setcontrasena(rowData.contrasena);
          setclave_Permiso(rowData.clave_Permiso);

          setDatosCopia({
            clave_Usuario:clave_Usuario,
            nombre_Usuario:nombre_Usuario,
              apellidoP_Usuario:apellidoP_Usuario,
              apellidoM_Usuario: apellidoM_Usuario,
              correo: correo,
              contrasena: contrasena,
              clave_Permiso:clave_Permiso
          });
          setAbrirDialog(2);
        }}          
      />     
      </>
  );
};    


  //MANDAR A LLAMAR A LA LISTA DE USUARIO
  useEffect(() => {
    PermisoService.consultarPermiso()
      .then(response => {
        setPermisos(response.data);
      })
      .catch(error => {
        console.error("Error fetching usuarios:", error);
      });
  }, []);
  
  //FUNCION PARA QUE SE MUESTRE LA INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_Permiso') {
      const per = permisos.find((per) => per.clave_Permiso === rowData.clave_Permiso);
      return per ? `${per.clave_Permiso} - ${per.nombre_Permiso}` : '';
    } else {
      return rowData[field]; // Si no es 'clave_Permiso' solo retorna el valor del campo
    }
  };
   
   //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Usuario</h4>)}
      {abrirDialog===2 && (<h4>Modificar Usuario</h4>)}
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
    <Toolbar start={<h2 className="m-0">Usuario</h2>} end={Herramientas}/>
    <ConfirmDialog />
      {/*PANEL PARA EL REGISTRO*/}
      <Dialog className='w-4' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
        <div className="field col-4">
        <label className='font-bold'>Permiso*</label>
            <Dropdown className="w-full"
              invalid={enviado===true && !clave_Permiso}
              value={clave_Permiso} 
              options={permisos} 
              onChange={(e) => {
                setclave_Permiso(e.value);
              }} 
              optionLabel="nombre_Permiso" 
              optionValue="clave_Permiso" 
              placeholder="Seleccione el Permiso del Usuario" 
            />
          </div> 
          <div className="field col-8">
          <label className='font-bold'>Nombre*</label>
              <InputText invalid={enviado===true && !nombre_Usuario} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setnombre_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Miguel" 
              className="w-full"/>              
          </div>
          <div className="field col-6">
          <label className='font-bold'>Apellido Paterno*</label>
              <InputText invalid={enviado===true && !apellidoP_Usuario} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={apellidoP_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setapellidoP_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Martinez" 
              className="w-full"/>              
          </div>
          <div className="field col-6">
          <label className='font-bold'>Apellido Materno*</label>
              <InputText invalid={enviado===true && !apellidoM_Usuario} type="text" keyfilter={/^[a-zA-Z\s]+$/} value={apellidoM_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setapellidoM_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Castellanos" 
              className="w-full"/>              
          </div>
          <div className="field col-8">
          <label className='font-bold'>Correo*</label>
              <InputText invalid={enviado===true && !correo} type="text" keyfilter={/^[a-zA-Z0-9\s@.]*$/} value={correo} maxLength={255}
                  onChange={(event)=>{
                    if (validarCorreo(event.target.value)) {  
                      setcorreo(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Licenciatura en Sistemas" 
              className="w-full"/>              
          </div>
          <div className="field col-8">
          <label className='font-bold'>Contraseña*</label>
              <InputText invalid={enviado===true && !contrasena} type="text" keyfilter={/^[a-zA-Z0-9\s@.]*$/} value={contrasena} maxLength={255}
                  onChange={(event)=>{
                
                      setcontrasena(event.target.value);
                    
                  }}  
                  placeholder="Ej.rrHH1960" 
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
        value={filtroUsuario.length ? filtroUsuario :usuariosList} 
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

export default Usuario