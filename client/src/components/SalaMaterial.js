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
import SalaService from '../services/SalaService';
import MaterialService from '../services/MaterialService';
import SalaMaterialService from '../services/SalaMaterialService';
const SalaMaterial = () => {
  //VARIABLES PARA EL REGISTRO
  const [cantidad_Material,setcantidad_Material] = useState(0);
  const [clave_Sala,setclave_Sala] = useState(0);
  const [clave_Material,setclave_Material] = useState(0);
  //VARIABLES PARA LA CONSULTA
  const [salamaterialList,setsalamaterialList] = useState([]);
  const [filtrosalamaterial, setfiltrosalamaterial] = useState([]);
  const [materiales, setmateriales] = useState([]);
  const [salas, setsalas] = useState([]);
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
    if (!cantidad_Material || !clave_Material || !clave_Sala) {
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    SalaMaterialService.registrarSalaMaterial({
      cantidad_Material:cantidad_Material,
      clave_Material:clave_Material,
      clave_Sala:clave_Sala
    }).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("Material ya existente en la Sala");
      }else if(error.response.status === 500){          
        mostrarError("Error interno del servidor");
      }  
    })
  }

  //FUNCION PARA CONSULTA
  const get = ()=>{
    SalaMaterialService.consultarSalaMaterial().then((response)=>{//CASO EXITOSO
      setsalamaterialList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }  

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    SalaMaterialService.modificarSalaMaterial(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificación Exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Material ya Existente en la Sala");
        get();
      }else if(error.response.status === 500){
        mostrarError("Error del sistema");
      }
    })
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setcantidad_Material(0);
    setclave_Sala(0);
    setclave_Material(0);
  };
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_SalaMaterial', header: 'Clave' },
    {field: 'cantidad_Material', header: 'Cantidad' },
    {field: 'clave_Sala', header: 'Clave Sala'},    
    {field: 'clave_Material', header: 'Clave Material'}    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []); 

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = salamaterialList.filter((item) => {
        return (
          item.cantidad_Sala.toLowerCase().includes(value) ||
          item.clave_Material.toString().includes(value) ||
          item.clave_Sala.toString().includes(value)          
        );
    });
    setfiltrosalamaterial(filteredData);
  };
  
  //MANDAR A LLAMAR A LA LISTA DE TIPOS DE SALA
  useEffect(() => {
    SalaService.consultarSala()
    .then(response => {
      setsalas(response.data);
    })
    .catch(error => {
      console.error("Error fetching sala:", error);
    });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE EDIFICIOS
  useEffect(() => {
    MaterialService.consultarMaterial()
    .then(response => {
      setmateriales(response.data);
    })
    .catch(error => {
      console.error("Error fetching material:", error);
    });
  }, []);
  
  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_Material') {
      const material = materiales.find((material) => material.clave_Material === rowData.clave_Material);
      return material ? `${material.nombre_Material}` : '';
    }else if (field === 'clave_Sala'){
      const sala = salas.find((sala) => sala.clave_Sala === rowData.clave_Sala);
      return sala ? `${sala.nombre_Sala}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };  

  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch(options.field){
      case 'cantidad_Material':
        return numberEditor(options);            
      case 'clave_Material':
        return MaterialEditor(options);    
      case 'clave_Sala':
        return SalaEditor(options);                     
      default:
        return numberEditor(options);
    }    
  };

  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="pint"  type="text" maxLength={11} value={options.value} 
    onChange={(e) => { 
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR DROPDOWN (Material)
  const MaterialEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={materiales}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_Material} - ${option.nombre_Material}`}
            optionValue="clave_Material" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Material" 
        />
    );
  };

  //EDITAR DROPDOWN (SALA)
  const SalaEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={salas}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.clave_Sala} - ${option.nombre_Sala}`}
            optionValue="clave_Sala"
            placeholder="Seleccione una Sala" 
        />
    );
  }; 
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'cantidad_Material':
        if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }else{
          event.preventDefault();
        } 
        break;
      case 'clave_Material':
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
  
  //!!!EXTRAS CAMPOS

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
      <Panel header="Registrar Sala" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Cantidad*</label>
              <InputText type="text" keyfilter="pint" value={cantidad_Material} maxLength={10}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setcantidad_Material(event.target.value);
                    }
                  }}  
                  placeholder="Ej.40"
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-5">
            <label>Sala*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_Sala} 
              options={salas} 
              onChange={(e) => {
                setclave_Sala(e.value);
              }} 
              optionLabel="nombre_Sala" 
              optionValue="clave_Sala" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una Sala" 
            />
          </div>
          <div className="field col-5">
            <label>Material*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_Material} 
              options={materiales} 
              onChange={(e) => {
                setclave_Material(e.value);
              }} 
              optionLabel="nombre_Material" 
              optionValue="clave_Material" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Material" 
            />
          </div>                                                                                
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Salas" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtrosalamaterial.length ? filtrosalamaterial :salamaterialList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'clave_TipoSala' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => seteditando(true)}/>;
          })}
        </DataTable>
      </Panel>            
    </>
  )
}

export default SalaMaterial