import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import { Toolbar } from 'primereact/toolbar';//NUEVO
import { Dialog } from 'primereact/dialog';//NUEVO
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';//NUEVO
import { IconField } from 'primereact/iconfield';//NUEVO
import { InputIcon } from 'primereact/inputicon';//NUEVO
import { FilterMatchMode } from 'primereact/api';
import HorarioService from '../services/HorarioService';
import DiaService from '../services/DiaService';
import SalaService from '../services/SalaService';

const Horario = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_Horario,setclave_Horario] = useState();  
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
  const dt = useRef(null);
  const [lazyState, setlazyState] = useState({
    filters: {
      clave_Horario: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      hora_Entrada: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      hora_Salida: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_Dia: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_SubGrupo: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
      clave_Sala: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    },
  });
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [datosCopia, setDatosCopia] = useState({
    clave_Horario: "",
    hora_Entrada: "",
    hora_Salida: "",
    clave_Dia: "",
    clave_SubGrupo: "",
    clave_Sala: ""
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
    if (!hora_Entrada || !hora_Salida || !clave_Dia || !clave_SubGrupo || !clave_Sala) {
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    const action = () => {
    HorarioService.registrarHorario({
        hora_Entrada:hora_Entrada,
        hora_Salida:hora_Salida,
        clave_Dia:clave_Dia,
        clave_SubGrupo:clave_SubGrupo,
        clave_Sala:clave_Sala      
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
        mostrarAdvertencia(toast,"La hora de Salida debe ser posterior a la hora de Entrada");
      } else if (error.response.status === 402) {
        mostrarAdvertencia(toast,"Ya existe un Registro en ese Horario");      
      }else if(error.response.status === 500){          
        mostrarError(toast,"Error interno del servidor");
      }     
    });
    };confirmar1(action);
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
  const put = () =>{
    //VALIDACION DE CAMPOS VACIOS
    if (!hora_Entrada || !hora_Salida || !clave_Dia || !clave_SubGrupo || !clave_Sala) {
      mostrarAdvertencia(toast,"Existen campos obligatorios vacíos");
      setEnviado(true);
      return;
    }
    if (clave_Horario === datosCopia.clave_Horario
      && hora_Entrada === datosCopia.hora_Entrada
      && hora_Salida === datosCopia.hora_Salida
      && clave_Dia === datosCopia.clave_Dia
      && clave_SubGrupo === datosCopia.clave_SubGrupo
      && clave_Sala === datosCopia.clave_Sala) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {        
    HorarioService.modificarHorario({
      clave_Horario:clave_Horario,
      hora_Entrada:hora_Entrada,
      hora_Salida:hora_Salida,
      clave_Dia:clave_Dia,
      clave_SubGrupo:clave_SubGrupo,
      clave_Sala:clave_Sala  
    }).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito(toast, "Modificación Exitosa");
        get();
        limpiarCampos();
        setEnviado(false);
        setAbrirDialog(0);
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
    }); 
    };confirmar1(action);
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
    {field: 'clave_Horario', header: 'Clave', filterHeader: 'Filtro por Clave' },
    {field: 'hora_Entrada', header: 'Entrada', filterHeader: 'Filtro por Entrada'},
    {field: 'hora_Salida', header: 'Salida', filterHeader: 'Filtro por Salida'},
    {field: 'clave_Dia', header: 'Día', filterHeader: 'Filtro por Dia'},
    {field: 'clave_SubGrupo', header: 'Subgrupo', filterHeader: 'Filtro por Subgrupo'},
    {field: 'clave_Sala', header: 'Sala', filterHeader: 'Filtro por Sala'}         
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
  
  //BOTON PARA MODIFICAR
  const accionesTabla = (rowData) => {
    return (<>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="m-1"
          onClick={() => {
            setclave_Horario(rowData.clave_Horario);
            sethora_Entrada(rowData.hora_Entrada);
            sethora_Salida(rowData.hora_Salida);
            setclave_Dia(rowData.clave_Dia);
            setclave_SubGrupo(rowData.clave_SubGrupo);
            setclave_Sala(rowData.clave_Sala);
            setDatosCopia({
              clave_Horario: rowData.clave_Horario,
              hora_Entrada: rowData.hora_Entrada,
              hora_Salida: rowData.hora_Salida,
              clave_Dia: rowData.clave_Dia,
              clave_SubGrupo: rowData.clave_SubGrupo,
              clave_Sala: rowData.clave_Sala
            });
            setAbrirDialog(2);
          }}          
        />     
        </>
    );
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

  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Horario</h4>)}
      {abrirDialog===2 && (<h4>Modificar Horario</h4>)}
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
    <Toolbar start={<h2 className="m-0">Horarios</h2>} end={Herramientas}/>
    <ConfirmDialog />    
      <Dialog className='w-10' header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
          <div className="formgrid grid mx-8 justify-content-center">
            <div className="field col-2">            
                <label>Hora de entrada*</label>
                <InputText type="time" value={hora_Entrada} maxLength={10} invalid={enviado===true && !hora_Entrada}
                    onChange={(event)=>{
                        sethora_Entrada(event.target.value);
                    }}  
                className="w-full"/>          
            </div>
            <div className="field col-2">
                <label>Hora de salida*</label>
                <InputText type="time" value={hora_Salida} maxLength={10} invalid={enviado===true && !hora_Salida}
                    onChange={(event)=>{
                        sethora_Salida(event.target.value);
                    }}  
                className="w-full"/>              
            </div>
            <div className="field col-3">
              <label>Día*</label>
              <Dropdown className="w-full" invalid={enviado===true && !clave_Dia}
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
              <Dropdown className="w-full"
                value={clave_SubGrupo}
                invalid={enviado===true && !clave_SubGrupo} 
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
              <Dropdown className="w-full"
                value={clave_Sala}
                invalid={enviado===true && !clave_Sala}  
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
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <DataTable
      onFilter={onFilter} filters={lazyState.filters} filterDisplay="row" 
      ref={dt} scrollable scrollHeight="78vh"  value={filtrohorario.length ? filtrohorario :horariolist} size='small'>
          {columns.map(({ field, header, filterHeader }) => {
              return <Column sortable filter filterPlaceholder={filterHeader} key={field} field={field} header={header}
              filterMatchModeOptions={[
                { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH },
                { label: 'Contiene', value: FilterMatchMode.CONTAINS },
                { label: 'No contiene', value: FilterMatchMode.NOT_CONTAINS },
                { label: 'Termina con', value: FilterMatchMode.ENDS_WITH },
                { label: 'Igual', value: FilterMatchMode.EQUALS },
                { label: 'No igual', value: FilterMatchMode.NOT_EQUALS },
              ]} 
              style={{minWidth:'40vh'}} bodyStyle={{textAlign:'center'}} body={(rowData) => renderBody(rowData, field)}
              />;
          })}
          <Column body={accionesTabla} alignFrozen={'right'} frozen={true}></Column>    
      </DataTable>                     
    </>
  )
}

export default Horario