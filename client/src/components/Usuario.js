import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import UsuarioService from '../services/UsuarioService';
import PermisoService from '../services/PermisoService';

const Usuario = () => {
  //VARIABLES PARA EL REGISTRO
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
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);
  
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
    if (!correo || !contrasena || !nombre_Usuario || !apellidoP_Usuario || !apellidoM_Usuario || !clave_Permiso) {      
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UsuarioService.registrarUsuario({
      nombre_Usuario:nombre_Usuario,
      apellidoP_Usuario:apellidoP_Usuario,
      apellidoM_Usuario: apellidoM_Usuario,
      correo: correo,
      contrasena: contrasena,
      clave_Permiso:clave_Permiso          
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {        
        mostrarAdvertencia("Clave ya existente");
      }else if(error.response.status === 401){
        mostrarAdvertencia("Correo ya existente");        
      }else if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }    
    });
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
  const put = (rowData) =>{
    UsuarioService.modificarUsuario(rowData).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación Exitosa");        
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("El correo ya se encuentra registrado");
        get();
      }else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
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
    {field: 'clave_Usuario', header: 'Clave' },
    {field: 'correo', header: 'Correo' },
    {field: 'contrasena', header: 'Contraseña' },
    {field: 'clave_Permiso', header: 'Permiso' },
    {field: 'nombre_Usuario', header: 'Nombre' },
    {field: 'apellidoP_Usuario', header: 'Apellido P' },
    {field: 'apellidoM_Usuario', header: 'Apellido M' }          
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
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch(options.field){
      case 'correo':
        return correoEditor(options);
      case 'clave_Permiso':
        return PermisoEditor(options);
      case 'contrasena':
        return contrasenaEditor(options);
      default:
        return textEditor(options);
    }    
  };

  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText keyfilter={/^[0-9a-zA-Z]*$/} type="text" maxLength={255} value={options.value} 
    onChange={(e) => { 
      if (validarTexto(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR CORREO
  const correoEditor = (options) => {
    return <InputText keyfilter="email"  type="text" maxLength={255} value={options.value} 
    onChange={(e) => { 
      if (validarCorreo(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR CONTRASEÑA
  const contrasenaEditor = (options) => {
    return <InputText type="text" maxLength={255} value={options.value} 
    onChange={(e) => {       
        options.editorCallback(e.target.value)      
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR DROPDOWN (PERMISO)
  const PermisoEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={permisos}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_Permiso} - ${option.nombre_Permiso}`}
            optionValue="clave_Permiso" // Aquí especificamos que la clave del permiso se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Permiso"              
        />
    );
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {            
      let { rowData, newValue, field, originalEvent: event } = e;                          
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO  
        case 'correo':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
            }else{                             
              event.preventDefault();
            } 
            break;
        case 'clave_Permiso':
            if (newValue !== rowData[field]){             
                rowData[field] = newValue;
                put(rowData);                       
            }else{
                event.preventDefault();
            } 
            break;             
        case 'contrasena':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
            }else{                             
                event.preventDefault();
            } 
            break;    
        case 'nombre_Usuario':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
            }else{                             
                event.preventDefault();
              } 
            break;
        case 'apellidoP_Usuario':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
            }else{                             
              event.preventDefault();
            } 
            break;
        case 'apellidoM_Usuario':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
            }else{                             
                event.preventDefault();
            } 
           break;         
        default:
          break;
      }
      seteditando(false);
  }; 

  //!!!EXTRAS CAMPOS

  const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return regex.test(value);
  };

  const validarCorreo = (value) => {
    // Expresión regular para validar el formato de un correo electrónico
    const regex = /^[a-zA-Z0-9\s@.]*$/;
    // Verificar si el correo coincide con la expresión regular
    return value==='' || regex.test(value);
  }; 

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Usuario" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8">
          <div className="field col-5">
              <label>Correo*</label>
              <InputText type="text" keyfilter={/^[a-zA-Z0-9\s@.]*$/} value={correo} maxLength={255}
                  onChange={(event)=>{
                    if (validarCorreo(event.target.value)) {
                      setcorreo(event.target.value);
                    }
                  }} 
                  placeholder="Ej.perezperez@uabc.edu.mx" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-3">
              <label>Contraseña*</label>
              <InputText type="text" value={contrasena} maxLength={255}
                  onChange={(event)=>{                    
                      setcontrasena(event.target.value);                    
                  }}  
                  placeholder="Ej.#rrHH2024" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div> 
          <div className="field col-3">
              <label>Permiso*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={clave_Permiso} 
              options={permisos} 
              onChange={(e) => {
                setclave_Permiso(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel = {(option) => `${option.clave_Permiso} - ${option.nombre_Permiso}`}
              optionValue="clave_Permiso" // Aquí especificamos que la clave del permiso se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Permiso"               
            />
          </div>
          <div className="field col-5">
              <label>Nombre*</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={nombre_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setnombre_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Fernando" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div> 
          <div className="field col-3">
              <label>Apellido Paterno*</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={apellidoP_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setapellidoP_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Ramírez" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div> 
          <div className="field col-3">
              <label>Apellido Materno*</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={apellidoM_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setapellidoM_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Sanchez" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div>                                                                                              
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Usuarios" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroUsuario.length ? filtroUsuario :usuariosList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '25rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '10%' }} 
              editor={field === 'clave_Usuario' ? null : (options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => seteditando(true)}
              body={(rowData) => renderBody(rowData, field)} // Llama a la función renderBody para generar el cuerpo de la columna
              />;
          })}
        </DataTable>          
      </Panel>     
    </>
  )
}

export default Usuario