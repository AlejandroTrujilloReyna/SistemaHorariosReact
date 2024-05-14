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
import HorarioActividadService from '../services/HorarioActividadService';
import DiaService from '../services/DiaService';
import DocenteService from '../services/DocenteService';
import ActividadService from '../services/ActividadService';

const HorarioActividad = () => {
  //VARIABLES PARA EL REGISTRO
  const [hora_EntradaHActividad,sethora_EntradaHActividad] = useState();
  const [hora_SalidaHActividad,sethora_SalidaHActividad] = useState();
  const [clave_Dia,setclave_Dia] = useState(null);
  const [no_Empleado,setno_Empleado] = useState(null);
  const [id_Actividad,setid_Actividad] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [horarioactividadList,sethorarioactividadList] = useState([]);
  const [filtrohorarioactividad, setfiltrohorarioactividad] = useState([]);
  const [dias, setDias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [actividades, setActividades] = useState([]);
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
    if (!hora_EntradaHActividad || !hora_SalidaHActividad || !clave_Dia || !no_Empleado || !id_Actividad) {
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    HorarioActividadService.registrarHorarioActividad({
        hora_EntradaHActividad:hora_EntradaHActividad,
        hora_SalidaHActividad:hora_SalidaHActividad,
        clave_Dia:clave_Dia,
        no_Empleado:no_Empleado,
        id_Actividad:id_Actividad      
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito("Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("La hora de Salida debe ser posterior a la hora de Entrada");
      } else if (error.response.status === 402) {
        mostrarAdvertencia("Ya existe un Registro en ese Horario");      
      }else if(error.response.status === 500){          
        mostrarError("Error interno del servidor");
      }     
    });
  }

  //FUNCION PARA CONSULTA
  const get = ()=>{
    HorarioActividadService.consultarHorarioActividad().then((response)=>{//CASO EXITOSO
      sethorarioactividadList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }
  
  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    HorarioActividadService.modificarHorarioActividad(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificación Exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("La hora de Salida debe ser posterior a la hora de Entrada");
        get();
      } else if (error.response.status === 402) {
        mostrarAdvertencia("Ya existe un Registro en ese Horario");
        get();      
      }else if(error.response.status === 500){          
        mostrarError("Error interno del servidor");
      }  
    })
  }  
  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    sethora_EntradaHActividad();
    sethora_SalidaHActividad();
    setclave_Dia(null);
    setno_Empleado(null);
    setid_Actividad(null);
  }

  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_HorarioActividad', header: 'Clave' },
    {field: 'hora_EntradaHActividad', header: 'Entrada' },
    {field: 'hora_SalidaHActividad', header: 'Salida'},
    {field: 'clave_Dia', header: 'Día'},
    {field: 'no_Empleado', header: 'Empleado'},
    {field: 'id_Actividad', header: 'Actividad'}         
  ];

  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = horarioactividadList.filter((item) => {
        return (
            item.clave_HorarioActividad.toString().includes(value)||
            item.hora_EntradaHActividad.toString().includes(value) ||
            item.hora_SalidaHActividad.toString().includes(value) ||
            item.clave_Dia.toString().includes(value)||
            item.no_Empleado.toString().includes(value)||
            item.id_Actividad.toString().includes(value)           
        );
    });
    setfiltrohorarioactividad(filteredData);
  };    

  //MANDAR A LLAMAR A LA LISTA DE DIAS
  useEffect(() => {
    DiaService.consultarDia()
      .then(response => {
        setDias(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []); 
  
  //MANDAR A LLAMAR A LA LISTA DE EMPLEADOS
  useEffect(() => {
    DocenteService.consultarDocente()
      .then(response => {
        setEmpleados(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);
  
  //MANDAR A LLAMAR A LA LISTA DE ACTIVIDADES
  useEffect(() => {
    ActividadService.consultarActividad()
      .then(response => {
        setActividades(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);
  
  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_Dia') {
      const dia = dias.find((dia) => dia.clave_Dia === rowData.clave_Dia);
      return dia ? `${dia.nombre_Dia}` : '';
    }else if (field === 'id_Actividad') {
      const actividad = actividades.find((actividad) => actividad.id_Actividad === rowData.id_Actividad);
      return actividad ? `${actividad.nombre_Actividad}` : '';
    }else {
      return rowData[field];
    }
  };

  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch (options.field) {
      case 'hora_EntradaHActividad':
        return timeEditor(options);
      case 'hora_SalidaHActividad':
        return timeEditor(options);
      case 'clave_Dia':
        return DiaEditor(options);
      case 'no_Empleado':
        return EmpleadoEditor(options);
      case 'id_Actividad':
        return ActividadEditor(options);        
      default:
        return 0;
    }
  };

// EDITOR DE TIEMPO
const timeEditor = (options) => {
  return <InputText type="time" value={options.value} 
  onChange={(e) =>{ 
      options.editorCallback(e.target.value)
  }}
  onKeyDown={(e) => e.stopPropagation()} />;
};

  //EDITAR DROPDOWN (DIA)
  const DiaEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={dias}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_Dia" 
                optionValue="clave_Dia"
                placeholder="Selecciona un Día" 
      />
    );
  };
  
  //EDITAR DROPDOWN (DIA)
  const EmpleadoEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={empleados}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="no_EmpleadoDocente" 
                optionValue="no_EmpleadoDocente"
                placeholder="Selecciona un Empleado" 
      />
    );
  };  
  
  //EDITAR DROPDOWN (DIA)
  const ActividadEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={actividades}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_Actividad" 
                optionValue="id_Actividad"
                placeholder="Selecciona una Actividad" 
      />
    );
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'hora_EntradaHActividad':
        if(newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;
      case 'hora_SalidaHActividad':
        if(newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;
      case 'clave_Dia':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;
      case 'no_Empleado':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;  
      case 'id_Actividad':
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
  
  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Horario de Actividad" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-2">            
              <label>Hora de entrada*</label>
              <InputText type="time" value={hora_EntradaHActividad} maxLength={10}
                  onChange={(event)=>{
                      sethora_EntradaHActividad(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>          
          </div>
          <div className="field col-2">
              <label>Hora de salida*</label>
              <InputText type="time" value={hora_SalidaHActividad} maxLength={10}
                  onChange={(event)=>{
                      sethora_SalidaHActividad(event.target.value);
                  }}  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>
          <div className="field col-3">
            <label>Día*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_Dia} 
              options={dias} 
              onChange={(e) => {
                setclave_Dia(e.value);
              }} 
              optionLabel="nombre_Dia" 
              optionValue="clave_Dia" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Día" 
            />
          </div>
          <div className="field col-3">
            <label>Empleado*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={no_Empleado} 
              options={empleados} 
              onChange={(e) => {
                setno_Empleado(e.value);
              }} 
              optionLabel="no_EmpleadoDocente" 
              optionValue="no_EmpleadoDocente" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Empleado" 
            />
          </div>
          <div className="field col-3">
            <label>Actividad*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={id_Actividad} 
              options={actividades} 
              onChange={(e) => {
                setid_Actividad(e.value);
              }} 
              optionLabel="nombre_Actividad" 
              optionValue="id_Actividad" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una Actividad" 
            />
          </div>                                                                                               
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Horarios de Actividades" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrohorarioactividad.length ? filtrohorarioactividad :horarioactividadList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_HorarioActividad' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => seteditando(true)}/>;
          })}
        </DataTable>
      </Panel>        
    </>
  )  
}

export default HorarioActividad