import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { Toast } from 'primereact/toast';
import SalaService from '../services/SalaService';
import EdificiosService from '../services/EdificioService';
import TipoSalaService from '../services/TipoSalaService';
import MaterialService from '../services/MaterialService';
import SalaMaterialService from '../services/SalaMaterialService';
import { MultiSelect } from 'primereact/multiselect';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';


const SalaN = () => {
  //VARIABLES ESTADO PARA LOS DIALOG, ACCIONES Y FILTRO TABLA
    const [mostrarDialog, setMostrarDialog] = useState(false);
    const [mostrarEliminarDialog, setMostrarEliminarDialog] = useState(false);
    const [frmEnviado, setFrmEnviado] = useState(false);
    const [accionesFrozen, setAccionesFrozen] = useState(false);    
    const [lazyState, setlazyState] = useState({
      filters: {
        clave_Sala: { value: '', matchMode: 'startsWith' },
        validar_Traslape: { value: '', matchMode: 'equals' },
        nombre_Sala: { value: '', matchMode: 'contains' },
        capacidad_Sala: { value: '', matchMode: 'startsWith' },
        nota_Descriptiva: { value: '', matchMode: 'contains' },
        clave_Edificio: { value: '', matchMode: 'startsWith' },
        clave_TipoSala: { value: '', matchMode: 'startsWith' },
        materiales: { value: '', matchMode: 'contains' }

      },
    });    
  //VARIABLES PARA EL REGISTRO
  const [clave_Sala,setclave_Sala] = useState("");
  const [nombre_Sala,setnombre_Sala] = useState("");
  const [capacidad_Sala,setcapacidad_Sala] = useState("");
  const [validar_Traslape,setvalidar_Traslape] = useState(1);
  const [nota_Descriptiva,setnota_Descriptiva] = useState("");
  const [clave_Edificio,setclave_Edificio] = useState(0);
  const [clave_TipoSala,setclave_TipoSala] = useState(0);
  const [materialesseleccionados,setmaterialesseleccionados] = useState([]);

  //VARIABLES PARA LA CONSULTA
  const [materialesList,setmaterialesList] = useState([]);
  const [salaList,setsalaList] = useState([]);
  const [filtrosala, setfiltrosala] = useState([]);
  const [edificios, setedificios] = useState([]);
  const [tiposalas, settiposalas] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);
  const dt = useRef(null);

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
  const save = () => {
    setFrmEnviado(true);
    //VALIDACION DE CAMPOS VACIOS
    if (!nombre_Sala || !capacidad_Sala || !clave_Edificio || !clave_TipoSala) {
      setFrmEnviado(true);
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    if (!editando) {

      SalaService.registrarSala({
        nombre_Sala: nombre_Sala,
        capacidad_Sala: capacidad_Sala,
        validar_Traslape: validar_Traslape,
        nota_Descriptiva: nota_Descriptiva,
        clave_Edificio: clave_Edificio,
        clave_TipoSala: clave_TipoSala
      }).then(response => {//CASO EXITOSO
        if (response.status === 200) {
          mostrarExito("Registro Exitoso");
          addMaterial();
          get();
          setFrmEnviado(false);
          limpiarCampos();
        }
      }).catch(error => {//EXCEPCIONES
        if (error.response.status === 401) {
          mostrarAdvertencia("Nombre ya existente en el Edificio");
        } else if (error.response.status === 500) {
          mostrarError("Error interno del servidor");
        }
      })
    } else {
      SalaService.modificarSala({
        clave_Sala: clave_Sala,
        nombre_Sala: nombre_Sala,
        capacidad_Sala: capacidad_Sala,
        validar_Traslape: validar_Traslape,
        nota_Descriptiva: nota_Descriptiva,
        clave_Edificio: clave_Edificio,
        clave_TipoSala: clave_TipoSala
      }
      ).then(response => {//CASO EXITOSO
        if (response.status === 200) {
          addMaterial();
          eliminarImpartir();
          mostrarExito("Modificación Exitosa");
          setFrmEnviado(false);
          seteditando(false);
          setMostrarDialog(false);
          get();
        }
      }).catch(error => {//EXCEPCIONES
        if (error.response.status === 401) {
          mostrarAdvertencia("Nombre ya Existente en el Edificio");
          get();
        } else if (error.response.status === 500) {
          mostrarError("Error del sistema");
        }
      })
    }
  }

  const eliminarImpartir = ()=>{
    if(materialesseleccionados.length ===0){// Si se desea que Unidades Aprendizaje a impartir pueda modificarse a vacio quitar
        return 0;
    }
    SalaMaterialService.eliminarSalaMaterial({
        clave_Sala:clave_Sala
      }).then(response => {//CASO EXITOSO
        if (response.status === 200) {
          //mostrarExito("Eliminación Impartir Exitosa");          
        }
      }).catch(error => {//EXCEPCIONES
        if (error.response.status === 500) {
          mostrarError("Error interno del servidor");
        }
      })
  }

  const addMaterial = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!materialesseleccionados) {      
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }

    for (let i = 0; i < materialesseleccionados.length; i++) {                    
      SalaMaterialService.registrarSalaMaterialdos({
        clave_Material:materialesseleccionados[i],
          clave_Sala:5     
      }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
          if(i===materialesseleccionados.length-1){
              //mostrarExito("Registro Exitoso");                            
          }
          //get();
          //limpiarCampos();
      }
      }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 500){  
          mostrarError("Error interno del servidor");
      }     
      });  
    }
    get();
  }

  //FUNCION PARA CONSULTA
  const get = ()=>{
    SalaService.consultarSala().then((response)=>{//CASO EXITOSO
      setsalaList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }  
  // FUNCION PARA ELIMINAR NOTA: delete parece ser una variable reservada
  const eliminar = ()=>{
    SalaService.eliminarSala({
      clave_Sala:clave_Sala
    }).then(response => {//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Eliminación Exitosa");
        get();
        setMostrarEliminarDialog(false);
        limpiarCampos();
      }
    }).catch(error => {//EXCEPCIONES
      if (error.response.status === 500) {
        mostrarError("Error interno del servidor");
      }
    })

  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS
  const limpiarCampos = () =>{
    setclave_Sala("");
    setnombre_Sala("");
    setcapacidad_Sala("");
    setvalidar_Traslape(1);
    setnota_Descriptiva(""); 
    setmaterialesseleccionados([]); 
   
  };
  
  
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []); 

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const traslapeValue = value === "si" ? "1" : value === "no" ? "0" : null;
    const filteredData = salaList.filter((item) => {
      const nombreEdificio = edificios.find(ed => ed.clave_Edificio === item.clave_Edificio)?.nombre_Edificio || '';      
      const tipoSalanombre = tiposalas.find(ed => ed.clave_TipoSala === item.clave_TipoSala)?.nombre_TipoSala || '';      
        return (
          (traslapeValue !== null && item.validar_Traslape.toString() === traslapeValue) ||
          item.nombre_Sala.toLowerCase().includes(value) ||
          item.capacidad_Sala.toString().includes(value) ||
          //item.validar_Traslape.toString().includes(value) ||          
          item.nota_Descriptiva.toLowerCase().includes(value) ||
          item.clave_Edificio.toString().includes(value) ||
          item.clave_TipoSala.toString().includes(value) ||
          nombreEdificio.toLowerCase().includes(value)  ||    
          tipoSalanombre.toLowerCase().includes(value)
        );
    });
    setfiltrosala(filteredData);
  };
  
  //MANDAR A LLAMAR A LA LISTAS NECESARIAS PARA REGISTRAR
  useEffect(() => {
    // Lista Tipo Sala
    TipoSalaService.consultarTipoSala()
    .then(response => {
      settiposalas(response.data);
    })
    .catch(error => {
      console.error("Error fetching tiposala:", error);
    });
    // Lista Edificios
    EdificiosService.consultarEdificio()
    .then(response => {
      setedificios(response.data);
    })
    .catch(error => {
      console.error("Error fetching edificios:", error);
    });
    // Lista Materiales
    MaterialService.consultarMaterial()
    .then(response => {
      setmaterialesList(response.data);
    })
    .catch(error => {
      console.error("Error fetching material:", error);
    });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_Edificio') {
      const edificio = edificios.find((edificio) => edificio.clave_Edificio === rowData.clave_Edificio);
      return edificio ? `${edificio.nombre_Edificio}` : '';
    }else if (field === 'clave_TipoSala'){
      const tiposala = tiposalas.find((tiposala) => tiposala.clave_TipoSala === rowData.clave_TipoSala);
      return tiposala ? `${tiposala.nombre_TipoSala}` : '';
    }else if (field === 'validar_Traslape') {
      return (
        <ToggleButton
          onLabel="Si"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={rowData[field] === 1}
          className="w-8rem"
          disabled={true} // Para hacerlo no editable
        />
      );
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };  

  //!!!EXTRAS VALIDACIONES CAMPOS

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

  //!!!EXTRAS DIALOG GUARDAR (REGISTRAR Y MODIFICAR)
  // Funcion para abrir Dialog para Registrar
  const abrirNuevo = () => {    
    setFrmEnviado(false);
    setMostrarDialog(true);
    limpiarCampos();
  };

  //Funcion para ocultar el Dialog de Guardado (Registrar o Modifcar)
  const esconderDialog = () => {
    setFrmEnviado(false);
    seteditando(false);    
    setMostrarDialog(false);
  };
  // Inicializa las constantes de la modificacion
  const inicializar = (sala) => {
    setclave_Sala(sala.clave_Sala);
    setclave_Edificio(sala.clave_Edificio);
    setnombre_Sala(sala.nombre_Sala);
    setcapacidad_Sala(sala.capacidad_Sala);
    setvalidar_Traslape(sala.validar_Traslape);
    setnota_Descriptiva(sala.nota_Descriptiva);
    setclave_TipoSala(sala.clave_TipoSala);    
    const MaterialArray = sala.materiales
    ? sala.materiales.split(',').map(Number)
    : [];

    setmaterialesseleccionados(MaterialArray);
  }

  // Funcion para contenido de Footer del Dialog Guardado
  const footerDialog = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={esconderDialog}></Button>
      <Button label="Guardar" icon="pi pi-check" onClick={save} />
    </React.Fragment>
  );

  // Funcion para iniciar con Edición
  const editSala = (sala) => {
    inicializar(sala);    
    setMostrarDialog(true);
    seteditando(true);
  };
  
  // Funcion para exportar en formato de excel
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  //Lado Izquierdo del Toolbar, boton Nuevo y boton para congelar columna acciones
  const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={abrirNuevo}/>  
            <ToggleButton checked={accionesFrozen} onChange={(e) => setAccionesFrozen(e.value)} onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Acciones" offLabel="Acciones" />          
        </div>
    );
  };
  //Lado Derecho del Toolbar, boton Exportar
  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help"  onClick={exportCSV}/>;
  };
  
  //!!!EXTRAS DIALOG DE CONFIRMACION DE ELIMINAR
  // Funcion para ocultar Dialog de Eliminar
  const ocultarEliminarDialog = () => {
    setMostrarEliminarDialog(false);
  };
  // Funcion para el footer del Dialog de ELiminar
  const footerDialogEliminar = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={ocultarEliminarDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={eliminar}
      />
    </React.Fragment>
  );
  
  // Funcion para motrar el Dialog de Eliminar
  const confirmarEliminar = (sala) => {
    inicializar(sala);
    setMostrarEliminarDialog(true);
  };

  //!!!EXTRAS TABLA
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_Sala', header: 'Clave', filterField:"clave_Sala"},
    {field: 'nombre_Sala', header: 'Nombre', filterField:"nombre_Sala"},
    {field: 'capacidad_Sala', header: 'Capacidad', filterField:"capacidad_Sala"},
    {field: 'validar_Traslape', header: 'Validar',},
    {field: 'nota_Descriptiva', header: 'Nota Descriptiva'},
    {field: 'clave_Edificio', header: 'Edificio'},    
    {field: 'clave_TipoSala', header: 'Tipo Sala'},
    {field: 'materiales', header: 'Materiales' }    
  ];

  //Cabecera de la Tabla
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Salas</h4>                              
        
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          //onInput={(e) => setGlobalFilter(e.target.value)}
        onInput={(e) => onSearch(e)}
          placeholder="Buscar..."
        />
      </IconField>
    </div>
    
  );

  // Contenido de la columna de Acciones (Modificar y Eliminar)
  const accionesTabla = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="m-1"
          onClick={() => editSala(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          className="m-1"
          onClick={() => confirmarEliminar(rowData)}
        />
      </React.Fragment>
    );
  };

  /*const toggleFilter = ({ value, onChange }) => {
    return(<ToggleButton
      id="vtraslape"
      onLabel="Si"
      onIcon="pi pi-check"
      offIcon="pi pi-times"
      checked={validar_Traslape === 1}
      onChange={(e) => setvalidar_Traslape(e.value ? 1 : 0)}
      className="w-8rem"
    />);
  };*/

  // Funcion Necesaria para filtrado
  const onFilter = (event) => {
    event['first'] = 0;
    setlazyState(event);
  };
 
  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />            
      {/*Dialog para Registrar y Modificar Sala*/} 
      <Dialog
        visible={mostrarDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Sala"
        modal
        className="p-fluid"
        footer={footerDialog}
        onHide={esconderDialog}
      >    
        <div className="formgrid grid">
            <div className="field col">
                <label htmlFor="Edificios" className="font-bold">Edificio*</label>
                <Dropdown
                id="Edificios"
                value={clave_Edificio} 
                options={edificios} 
                onChange={(e) => {
                    setclave_Edificio(e.value);
                }} 
                autoFocus
                required
                optionLabel="nombre_Edificio" 
                optionValue="clave_Edificio" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione un Edificio" 
                className={classNames({ 'p-invalid': frmEnviado && !clave_Edificio })}
                />
                {frmEnviado && !clave_Edificio && (
                    <small className="p-error">Se requiere el Edificio.</small>
                )}
            </div>
            <div className="field col">
                <label htmlFor="TiposSalas" className="font-bold">Tipo de Sala*</label>
                <Dropdown 
                id="TiposSalas"
                value={clave_TipoSala} 
                options={tiposalas} 
                onChange={(e) => {
                    setclave_TipoSala(e.value);
                }} 
                required
                optionLabel="nombre_TipoSala" 
                optionValue="clave_TipoSala" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Seleccione un Tipo de Sala" 
                className={classNames({ 'p-invalid': frmEnviado && !clave_TipoSala })}
                />
                {frmEnviado && !clave_TipoSala && (
                    <small className="p-error">Se requiere el Tipo de Sala.</small>
                )}
            </div>
        </div>           
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="Nombre" className="font-bold">
              Nombre*
            </label>
            <InputText
              id="Nombre"
              type="text" 
              keyfilter={ /^[0-9a-zA-Z]*$/}
              value={nombre_Sala}
              //onValueChange={(e) => onInputNumberChange(e, 'price')}
              onChange={(event)=>{
                    setnombre_Sala(event.target.value);
              }}  
              required            
              maxLength={255}
              placeholder="Ej.205"
              className={classNames({ 'p-invalid': frmEnviado && !nombre_Sala })}
            />  
            {frmEnviado && !nombre_Sala && (
                <small className="p-error">Se requiere el Nombre.</small>
            )}          
          </div>
          <div className="field col">
              <label htmlFor="Capacidad" className="font-bold">Capacidad*</label>
              <InputText id="Capacidad" type="text" keyfilter="pint" value={capacidad_Sala} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setcapacidad_Sala(event.target.value);
                    }
                  }}  
                  required
                  placeholder="Ej.40"
                  className={classNames({ 'p-invalid': frmEnviado && !capacidad_Sala })}
              />
              {frmEnviado && !capacidad_Sala && (
                    <small className="p-error">Se requiere la Capacidad.</small>
                )} 
          </div>                    
        </div>
        <div className="field">
              <label htmlFor="vtraslape" className="font-bold">¿Se debe validar el traslape?* </label>
              <ToggleButton
                id="vtraslape"
                onLabel="Si"
                onIcon="pi pi-check" 
                offIcon="pi pi-times" 
                checked={validar_Traslape === 1} 
                onChange={(e) => setvalidar_Traslape(e.value ? 1 : 0)} 
                className="w-8rem" 
            />
        </div>
        <div className="field col">
              <label htmlFor="notas" className="font-bold">Notas</label>
              <InputTextarea id="notas" type="text" value={nota_Descriptiva} maxLength={100}
                  onChange={(event)=>{
                    setnota_Descriptiva(event.target.value);
                  }}
                  placeholder="Ej.Espacio para impartir clase teóricas"  
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
        </div>
        <div className="field col">
            <label htmlFor="Materiales" className="font-bold">Materiales*</label>
            <MultiSelect 
            id="Materiales"
            value={materialesseleccionados} 
            options={materialesList} 
            onChange={(e) => {
                setmaterialesseleccionados(e.value);
            }} 
            required
            filter
            optionLabel = {(option) => `${option.clave_Material} - ${option.nombre_Material}`}
            optionValue="clave_Material" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Materiales para seleccionar" 
            display="chip"
            className={classNames({ 'p-invalid': frmEnviado && !materialesseleccionados.length })}
            />
            {frmEnviado && !materialesseleccionados && (
                <small className="p-error">Se requiere almenos un Material.</small>
            )}
          </div>
      </Dialog>
      {/*Dialog para Confirmación de eliminar*/} 
      <Dialog
        visible={mostrarEliminarDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirmar"
        modal
        footer={footerDialogEliminar}
        onHide={ocultarEliminarDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {clave_Sala && (
            <span>
              ¿Está seguro de que quiere eliminar <b>{clave_Sala} - {nombre_Sala}</b>?
            </span>
          )}
        </div>
      </Dialog>   
      {/*Barra de herramientas con boton nuevo, boton para anclar la columna de Acciones y Exportar*/} 
      <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
      {/*Tabla de Contenido*/}         
      <div className="card">        
        <DataTable ref={dt} value={filtrosala.length ? filtrosala :salaList} scrollable scrollHeight="400px" size='small' tableStyle={{ minWidth: '50rem' }}         
        filterDisplay="row"         
        onFilter={onFilter}       
        filters={lazyState.filters}
          
          header={header}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
               filter filterPlaceholder="Buscar"/>;
          })}
          <Column
            body={accionesTabla}
            exportable={false}
            style={{ minWidth: '15%' }}
            alignFrozen="right" 
            frozen={accionesFrozen}
          ></Column>
        </DataTable>
      </div>            
    </>
  )
}

export default SalaN