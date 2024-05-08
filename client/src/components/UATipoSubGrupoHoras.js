import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';
import TipoSubGrupoService from '../services/TipoSubGrupoService';
import UATipoSubGrupoHorasService from '../services/UATipoSubGrupoHorasService'

const UATipoSubGrupoHoras = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_UATipoSubGrupoHoras,setclave_UATipoSubGrupoHoras] = useState(0);
  const [horas,sethoras] = useState(0);
  const [clave_UnidadAprendizaje,setclave_UnidadAprendizaje] = useState(null);
  const [clave_TipoSubGrupo,setclave_TipoSubGrupo] = useState(null);
  
  //VARIABLES PARA LA CONSULTA
  const [uatiposubgrupohorasList,setuatiposubgrupohorasList] = useState([]);
  const [filtrouatiposubgrupohoras, setfiltrouatiposubgrupohoras] = useState([]);
  const [TiposSubgrupos, setTiposSubgrupos] = useState([]);
  const [UnidadesAprendizaje, setUnidadesAprendizaje] = useState([]);
  
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
    if (!clave_UATipoSubGrupoHoras || !clave_TipoSubGrupo || !clave_UnidadAprendizaje || !horas) {
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UATipoSubGrupoHorasService.registrarUATipoSubGrupoHoras({
      clave_UATipoSubGrupoHoras:clave_UATipoSubGrupoHoras,
      horas:horas,
      clave_TipoSubGrupo:clave_TipoSubGrupo,
      clave_UnidadAprendizaje:clave_UnidadAprendizaje,
    
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito("Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya existente");
      } else if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya existente");      
      }else if(error.response.status === 500){          
        mostrarError("Error interno del servidor");
      }     
    });
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    UATipoSubGrupoHorasService.consultarUATipoSubGrupoHoras().then((response)=>{//CASO EXITOSO
      setuatiposubgrupohorasList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    UATipoSubGrupoHorasService.modificarUATipoSubGrupoHoras(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificacion exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");
        get();
      }else if(error.response.status === 500){
        mostrarError("Error del sistema");
      }
    })
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_TipoSubGrupo(0);
    setclave_UATipoSubGrupoHoras(0);
    setclave_UnidadAprendizaje(0);
    sethoras(0);
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_UATipoSubGrupoHoras', header: 'Clave' },
    {field: 'horas', header: 'Horas' },
    {field: 'clave_UnidadAprendizaje', header: 'Unidad Aprendizaje'},
    {field: 'clave_TipoSubGrupo', header: 'Tipo SubGrupo'},
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //ORDENAR LOS DATOS POR LA CLAVE AL INGRESAR A LA PAGINA
  useEffect(() => {
    setfiltrouatiposubgrupohoras([...uatiposubgrupohorasList].sort((a, b) => a.clave_UATipoSubGrupoHoras - b.clave_UATipoSubGrupoHoras));
  }, [uatiposubgrupohorasList]);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = uatiposubgrupohorasList.filter((item) => {
        return (
            item.clave_UATipoSubGrupoHoras.toString().includes(value) ||
            item.clave_TipoSubGrupo.toString().includes(value) ||
            item.clave_UnidadAprendizaje.toString().includes(value) ||
            item.horas.toString().includes(value)          
        );
    });
    setfiltrouatiposubgrupohoras(filteredData);
  }; 

  //MANDAR A LLAMAR A LA LISTA DE UNIDADES ACADEMICAS
  useEffect(() => {
    TipoSubGrupoService.consultarTipoSubGrupo()
      .then(response => {
        setTiposSubgrupos(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos sub grupos:", error);
      });
  }, []);

  useEffect(() => {
    UnidadAprendizajeService.consultarUnidadAprendizaje()
      .then(response => {
        setUnidadesAprendizaje(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipos sub grupos:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_TipoSubGrupo') {
      const unidad = TiposSubgrupos.find((unidad) => unidad.clave_TipoSubGrupo === rowData.clave_TipoSubGrupo);
      return unidad ? `${unidad.nombre_TipoSubGrupo}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch (options.field) {
      case 'clave_TipoSubGrupo':
        return TipoSubGrupoEditor(options);
      case 'horas':
        return numberEditor(options);
      case 'clave_UnidadAprendizaje':
        return UnidadAprendizajeEditor(options);
      default:
        return textEditor(options);  
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
  

  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="int"  type="text" maxLength={6} value={options.value} 
    onChange={(e) => {
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }} onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR DROPDOWN (TipoSubGrupo)
  const TipoSubGrupoEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={TiposSubgrupos}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_TipoSubGrupo" 
                optionValue="clave_TipoSubGrupo" 
                placeholder="Selecciona un Tipo de SubGrupo" 
      />
    );
  };    
  
  const UnidadAprendizajeEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={UnidadesAprendizaje}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_UnidadAprendizaje" 
                optionValue="clave_UnidadAprendizaje" 
                placeholder="Selecciona una unidad de aprendizaje" 
      />
    );
  };    

  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
      let { rowData, newValue, field, originalEvent: event } = e;
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
        case 'clave_UnidadAprendizaje':
          if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
            rowData[field] = newValue; put(rowData);
          }else{
            event.preventDefault();
          }
          break;  
        case 'clave_TipoSubGrupo':
          if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
            rowData[field] = newValue; put(rowData);
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

  const validarNumero = (value) => {
    // Expresión regular para validar números enteros positivos
    const regex = /^[0-9]\d*$/;
    // Verificar si el valor coincide con la expresión regular
    return value==='' || regex.test(value);
  };  

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar UA Tipo SubGrupo" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_UATipoSubGrupoHoras} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {  
                      setclave_UATipoSubGrupoHoras(event.target.value);
                    }
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Horas</label>
              <InputText type="text" keyfilter="pint" value={horas} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {    
                      	sethoras(event.target.value);
                    }
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-6">
              <label>Tipo SubGrupo</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_TipoSubGrupo} 
              options={TiposSubgrupos} 
              onChange={(e) => {
                setclave_TipoSubGrupo(e.value);
              }} 
              optionLabel="nombre_TipoSubGrupo" 
              optionValue="clave_TipoSubGrupo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un tipo de Sub Grupo" 
            />
          </div>                                                                           
          <div className="field col-6">
              <label>Unidad Aprendizaje</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_UnidadAprendizaje} 
              options={UnidadesAprendizaje} 
              onChange={(e) => {
                setclave_UnidadAprendizaje(e.value);
              }} 
              optionLabel="nombre_UnidadAprendizaje" 
              optionValue="clave_UnidadAprendizaje" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una unidad de aprendizaje" 
            />
          </div> 
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
      </Panel>    
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar UA Tipo SubGrupo" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrouatiposubgrupohoras.length ? filtrouatiposubgrupohoras :uatiposubgrupohorasList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_UATipoSubGrupoHoras' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>  
    </>
  )
}

export default UATipoSubGrupoHoras