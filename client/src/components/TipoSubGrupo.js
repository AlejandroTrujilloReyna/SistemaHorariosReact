import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import TipoSubGrupoService from '../services/TipoSubGrupoService';

const TipoSubGrupo = () => {
    //VARIABLES PARA EL REGISTRO
    const [nombre_TipoSubGrupo,setnombre_TipoSubGrupo] = useState("");

    //VARIABLES PARA LA CONSULTA
    const [tiposubgrupoList,settiposubgrupoList] = useState([]);
    const [filtrotiposubgrupo, setfiltrotiposubgrupo] = useState([]);

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
      if (!nombre_TipoSubGrupo) {
        mostrarAdvertencia("Existen campos vacíos");
        return;
      }
      //MANDAR A LLAMAR AL REGISTRO SERVICE
        TipoSubGrupoService.registrarTipoSubGrupo({
        nombre_TipoSubGrupo:nombre_TipoSubGrupo,
   
      }).then(response=>{
        if (response.status === 200) {//CASO EXITOSO
          mostrarExito("Registro Exitoso");
          get();
          limpiarCampos();
        }
      }).catch(error=>{//EXCEPCIONES
        if (error.response.status === 401) {
          mostrarAdvertencia("Nombre ya Existente");      
        }else if(error.response.status === 500){          
          mostrarError("Error interno del servidor");
        }     
      });
    }  
  
    //FUNCION PARA CONSULTA
    const get = ()=>{
      TipoSubGrupoService.consultarTipoSubGrupo().then((response)=>{//CASO EXITOSO
        settiposubgrupoList(response.data);  
      }).catch(error=>{//EXCEPCIONES
        if (error.response.status === 500) {
          //setmensajeError("Error del sistema");
        }
      });    
    }
  
    //FUNCION PARA LA MODIFICACION
    const put = (rowData) =>{
      TipoSubGrupoService.modificarTipoSubGrupo(rowData).then(response=>{//CASO EXITOSO
        if(response.status === 200){
          mostrarExito("Modificación Exitosa");
        }
      }).catch(error=>{//EXCEPCIONES
        if(error.response.status === 401){
          mostrarAdvertencia("Nombre ya Existente");
          get();
        }else if(error.response.status === 500){
          mostrarError("Error del sistema");
        }
      })
    }
  
    //!!!EXTRAS DE REGISTRO
  
    //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
    const limpiarCampos = () =>{
      setnombre_TipoSubGrupo("");
    }
    
    //!!!EXTRAS DE CONSULTA
  
    //COLUMNAS PARA LA TABLA
    const columns = [
      {field: 'clave_TipoSubGrupo', header: 'Clave' },
      {field: 'nombre_TipoSubGrupo', header: 'Nombre' } 
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
  
    //MANDAR A LLAMAR A LA LISTA DE UNIDADES ACADEMICAS
    /*useEffect(() => {
      TipoSubGrupoService.consultarTipoSubGrupo()
        .then(response => {
          setUnidadesAcademicas(response.data);
        })
        .catch(error => {
          console.error("Error fetching unidades académicas:", error);
        });
    }, []);*/
  
    //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
    /*const renderBody = (rowData, field) => {
      if (field === 'clave_UnidadAcademica') {
        const unidad = unidadesAcademicas.find((unidad) => unidad.clave_UnidadAcademica === rowData.clave_UnidadAcademica);
        return unidad ? `${unidad.nombre_UnidadAcademica}` : '';
      }else {
        return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
      }
    };*/
    
    //!!!EXTRAS DE MODIFICACION
  
    //ACTIVAR EDICION DE CELDA
    const cellEditor = (options) => {
      seteditando(true);
      switch (options.field) {
        case 'nombre_TipoSubGrupo':
          return textEditor(options); 
        default:
          break;
      }
    };
  
    //EDITAR TEXTO
    const textEditor = (options) => {
      return <InputText keyfilter={/[a-zA-Z\s]/} maxLength={255} type="text" value={options.value} 
      onChange={(e) =>{ 
        if (validarTexto(e.target.value)) { 
          options.editorCallback(e.target.value)
        }
      }}
      onKeyDown={(e) => e.stopPropagation()} />;
    };
  
    //EDITAR DROPDOWN (UNIDAD ACADEMICA)  
  
    //COMPLETAR MODIFICACION
    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        switch (field) {
          //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
          case 'nombre_TipoSubGrupo':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
              rowData[field] = newValue; put(rowData);
            }
            else{
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
  
  
  
    return (
      <>
      {/*APARICION DE LOS MENSAJES (TOAST)*/}
      <Toast ref={toast} />
        {/*PANEL PARA EL REGISTRO*/}
        <Panel header="Registrar Tipo SubGrupo" className='mt-3' toggleable>
          <div className="formgrid grid mx-8 justify-content-center">
            
            <div className="field col-10">
                <label>Nombre*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_TipoSubGrupo} maxLength={255}
                    onChange={(event)=>{
                      if (validarTexto(event.target.value)) {  
                        setnombre_TipoSubGrupo(event.target.value);
                      }
                    }}  
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
            </div>                                                                           
          </div>
          <div className="mx-8 mt-4">
            <Button label="Guardar" onClick={add} className="p-button-success" />
          </div>   
        </Panel>    
        {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
        <Panel header="Consultar Tipos de SubGrupos" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>  
          <DataTable value={filtrotiposubgrupo.length ? filtrotiposubgrupo :tiposubgrupoList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
            {columns.map(({ field, header }) => {
                return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} editor={field === 'clave_TipoSubGrupo' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
            })}
          </DataTable>
        </Panel>  
      </>
    )
  }
  
  export default TipoSubGrupo