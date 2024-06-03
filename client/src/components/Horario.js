import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { mostrarExito, mostrarAdvertencia, mostrarError } from '../services/ToastService';
import HorarioService from '../services/HorarioService';
import DiaService from '../services/DiaService';
import SalaService from '../services/SalaService';

const Horario = () => {
  //VARIABLES PARA EL REGISTRO  
  const [hora_Entrada,sethora_Entrada] = useState();
  const [hora_Salida,sethora_Salida] = useState();
  const [clave_Dia,setclave_Dia] = useState(null);
  const [clave_SubGrupo,setclave_SubGrupo] = useState(null);
  const [clave_Sala,setclave_Sala] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [horariolist,sethorariolist] = useState([]);
  const [filtrohorario,setfiltrohorario] = useState([]);
  const [dias, setDias] = useState([]);
  const [subgrupos, setSubgrupos] = useState([]);
  const [salas, setSalas] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);  
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);

  //FUNCION PARA REGISTRAR
  const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!hora_Entrada || !hora_Salida || !clave_Dia || !clave_SubGrupo || !clave_Sala) {
      mostrarAdvertencia(toast,"Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    HorarioService.registrarHorario({
        hora_Entrada:hora_Entrada,
        hora_Salida:hora_Salida,
        clave_Dia:clave_Dia,
        clave_SubGrupo:clave_SubGrupo,
        clave_Sala:clave_Sala      
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito(toast,"Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia(toast,"La hora de Salida debe ser posterior a la hora de Entrada");
      } else if (error.response.status === 402) {
        mostrarAdvertencia(toast,"Ya existe un Registro en ese Horario");      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }     
    });
  }
  
  //FUNCION PARA CONSULTA
  const get = ()=>{
    HorarioService.consultarHorario().then((response)=>{//CASO EXITOSO
      sethorariolist(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }
  
  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    HorarioService.modificarHorario(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito(toast,"Modificación Exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia(toast,"La hora de Salida debe ser posterior a la hora de Entrada");
        get();
      } else if (error.response.status === 402) {
        mostrarAdvertencia(toast,"Ya existe un Registro en ese Horario");
        get();      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }
    })
  }    
  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    sethora_Entrada("");
    sethora_Salida("");
    setclave_Dia(null);
    setclave_SubGrupo(null);
    setclave_Sala(null);
  } 
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_Horario', header: 'Clave' },
    {field: 'hora_Entrada', header: 'Entrada' },
    {field: 'hora_Salida', header: 'Salida'},
    {field: 'clave_Dia', header: 'Día'},
    {field: 'clave_SubGrupo', header: 'Subgrupo'},
    {field: 'clave_Sala', header: 'Sala'}         
  ];  

  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = horariolist.filter((item) => {
        return (
            item.clave_Horario.toString().includes(value)||
            item.hora_Entrada.toString().includes(value) ||
            item.hora_Salida.toString().includes(value) ||
            item.clave_Dia.toString().includes(value)||
            item.clave_SubGrupo.toString().includes(value)||
            item.clave_Sala.toString().includes(value)           
        );
    });
    setfiltrohorario(filteredData);
  };     
  
  //MANDAR A LLAMAR A LA LISTA DE DIAS
  useEffect(() => {
    DiaService.consultarDia()
      .then(response => {
        setDias(response.data);
      })
      .catch(error => {
        console.error("Error fetching dia:", error);
      });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE DIAS
  useEffect(() => {
    HorarioService.CONSULTARSG()
      .then(response => {
        setSubgrupos(response.data);
      })
      .catch(error => {
        console.error("Error fetching subgrupos:", error);
      });
  }, []);
  
  //MANDAR A LLAMAR A LA LISTA DE DIAS
  useEffect(() => {
    SalaService.consultarSala()
      .then(response => {
        setSalas(response.data);
      })
      .catch(error => {
        console.error("Error fetching salas:", error);
      });
  }, []);
  
  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_Dia') {
      const dia = dias.find((dia) => dia.clave_Dia === rowData.clave_Dia);
      return dia ? `${dia.nombre_Dia}` : '';
    }else if (field === 'clave_SubGrupo') {
      const subgrupo = subgrupos.find((subgrupo) => subgrupo.clave_SubGrupo === rowData.clave_SubGrupo);
      return subgrupo ? `${subgrupo.no_SubGrupo}` : '';
    }else if (field === 'clave_Sala') {
      const sala = salas.find((sala) => sala.clave_Sala === rowData.clave_Sala);
      return sala ? `${sala.nombre_Sala}` : '';
    }else {
      return rowData[field];
    }
  };

  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch (options.field) {
      case 'hora_Entrada':
        return timeEditor(options);
      case 'hora_Salida':
        return timeEditor(options);
      case 'clave_Dia':
        return DiaEditor(options);
      case 'clave_SubGrupo':
        return SubgrupoEditor(options);
      case 'clave_Sala':
        return SalaEditor(options);        
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
  
  //EDITAR DROPDOWN (SUBGRUPO)
  const SubgrupoEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={subgrupos}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="no_SubGrupo" 
                optionValue="clave_SubGrupo"
                placeholder="Selecciona un Subgrupo" 
      />
    );
  };
  
  //EDITAR DROPDOWN (SALA)
  const SalaEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={salas}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_Sala" 
                optionValue="clave_Sala"
                placeholder="Selecciona una Sala" 
      />
    );
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'hora_Entrada':
        if(newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;
      case 'hora_Salida':
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
      case 'clave_SubGrupo':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        }
        break;  
      case 'clave_Sala':
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
      <Panel header="Registrar Horario" className='mt-3' toggleable>
          <div className="formgrid grid mx-8 justify-content-center">
            <div className="field col-2">            
                <label>Hora de entrada*</label>
                <InputText type="time" value={hora_Entrada} maxLength={10}
                    onChange={(event)=>{
                        sethora_Entrada(event.target.value);
                    }}  
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>          
            </div>
            <div className="field col-2">
                <label>Hora de salida*</label>
                <InputText type="time" value={hora_Salida} maxLength={10}
                    onChange={(event)=>{
                        sethora_Salida(event.target.value);
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
              <label>Subgrupo*</label>
              <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={clave_SubGrupo} 
                options={subgrupos} 
                onChange={(e) => {
                  setclave_SubGrupo(e.value);
                }} 
                optionLabel="clave_SubGrupo" 
                optionValue="clave_SubGrupo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione un Subgrupo" 
              />
            </div>
            <div className="field col-3">
              <label>Sala*</label>
              <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={clave_Sala} 
                options={salas} 
                onChange={(e) => {
                  setclave_Sala(e.value);
                }} 
                optionLabel="nombre_Sala" 
                optionValue="clave_Sala" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione una Salas" 
              />
            </div>                                                                                               
          </div>
          <div className="mx-8 mt-4">
            <Button label="Guardar" onClick={add} className="p-button-success" />
          </div>   
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Horarios" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>
      <DataTable value={filtrohorario.length ? filtrohorario :horariolist} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_Horario' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => seteditando(true)}/>;
          })}
      </DataTable>                
      </Panel>        
    </>
  )
}

export default Horario