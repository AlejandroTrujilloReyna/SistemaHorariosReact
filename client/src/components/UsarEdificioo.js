import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import UsarEdificioService from '../services/UsarEdificioService';
import ProgramaEducativoService from '../services/ProgramaEducativoService';
import EdificioService from '../services/EdificioService';
const  UsarEdificioo = () => {
  //VARIABLES PARA EL REGISTRO
  //const [clave_UsarEdificio,setclave_UsarEdificio] = useState();
  const [clave_Edificio,setclave_Edificio] = useState(null);
  const [clave_ProgramaEducativo,setclave_ProgramaEducativo] = useState(null);


const [usaredificiolist, setusaredificiolist] = useState([]);
const [filtroUsarEdificio, setfiltroUsarEdificio] = useState([])
const [edificios, setedificios] = useState([]);
const [programaseducativos, setprogramaseducativos] = useState([])

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
  if (!clave_Edificio|| !clave_ProgramaEducativo) {
    mostrarAdvertencia("Existen campos Obligatorios vacíos");
    return;
  }

  //MANDAR A LLAMAR AL REGISTRO SERVICE
  UsarEdificioService.registrarUsarEdificio({
      clave_Edificio:clave_Edificio,
      clave_ProgramaEducativo:clave_ProgramaEducativo     
  }).then(response=>{
    if (response.status === 200) {//CASO EXITOSO
      mostrarExito("Registro exitoso");
      get();
      limpiarCampos();
    }
  }).catch(error=>{//EXCEPCIONES
    if(error.response.status === 500){          
      mostrarError("Error interno del servidor");
    } else if (error.response.status === 401) {
      mostrarAdvertencia("Ya existe un Programa Educativo asignado al edificio");      
    }    
  });
}


  //FUNCION PARA CONSULTA
  const get = ()=>{
    UsarEdificioService.consultarUsarEdificio().then((response)=>{//CASO EXITOSO
      setusaredificiolist(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }
  
  
  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    UsarEdificioService.modificarUsarEdificio(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificación Exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        mostrarError("Error interno del servidor ");
        
      } else if(error.response.status === 401){          
        mostrarAdvertencia("El programa educativo ya e encuentra asignado al edificio");
        get();
      }  
    })
  }  



  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    
    setclave_Edificio(null);
    setclave_ProgramaEducativo(null);
  }

//!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'clave_UsarEdificio', header: 'Clave' },
    {field: 'clave_Edificio', header: 'Edificio' },
    {field: 'clave_ProgramaEducativo', header: 'Programa Educativo'}
       
  ];


//MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
useEffect(() => {
    get();
  }, []);
  
 //FUNCION PARA LA BARRA DE BUSQUEDA
 const onSearch = (e) => {
  const value = e.target.value.toLowerCase();
  const filteredData = usaredificiolist.filter((item) => {
    //const edifi = item.clave_Edificio ? item.clave_Edificio.toString() : '';
    //const programaed = item.clave_ProgramaEducativo ? item.clave_ProgramaEducativo.toString() : '';
    const nombreedifi = edificios.find(tip => tip.clave_Edificio === item.clave_Edificio)?.nombre_Edificio || '';
    const nombreprogramaed = programaseducativos.find(grad => grad.clave_ProgramaEducativo=== item.clave_ProgramaEducativo)?.nombre_ProgramaEducativo || '';
     
    
    return (
          item.clave_UsarEdificio.toString().includes(value)||
      //    edifi.toString().includes(value) ||
        //  programaed.toString().includes(value) ||         
          nombreedifi.toLowerCase().includes(value) ||
          nombreprogramaed.toLowerCase().includes(value)
        );
  });
  setfiltroUsarEdificio(filteredData);
};  


//MANDAR A LLAMAR A LA LISTA DE EDIFICIOS
useEffect(() => {
    EdificioService.consultarEdificio()
      .then(response => {
        setedificios(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []); 
  
  //MANDAR A LLAMAR A LA LISTA DE PROGRAMAS EDUCATIVOS
useEffect(() => {
    ProgramaEducativoService.consultarProgramaEducativo()
      .then(response => {
        setprogramaseducativos(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []); 


  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'clave_Edificio') {
      const edi = edificios.find((edi) => edi.clave_Edificio === rowData.clave_Edificio);
      return edi ? `${edi.nombre_Edificio}` : '';
    }else if (field === 'clave_ProgramaEducativo') {
      const programaedu = programaseducativos.find((programaedu) => programaedu.clave_ProgramaEducativo === rowData.clave_ProgramaEducativo);
      return programaedu ? `${programaedu.nombre_ProgramaEducativo}` : '';
    }else {
      return rowData[field];
    }
  };

//!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch (options.field) {
      case 'clave_Edificio':
        return EdificioEditor(options);
      case 'clave_ProgramaEducativo':
        return ProgramaEducativoEditor(options);        
      default:
        return 0;
    }
  };

  //EDITAR DROPDOWN (EDIFICIO)
  const EdificioEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={edificios}  
                onChange={(e) => options.editorCallback(e.value)}
               optionLabel="nombre_Edificio" 
                optionValue="clave_Edificio"
                placeholder="Selecciona un Edificio" 
      />
    );
  };

    //EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
    const ProgramaEducativoEditor = (options) => {
      return (
        <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                  value={options.value} 
                  options={programaseducativos}  
                  onChange={(e) => options.editorCallback(e.value)}
                 optionLabel="nombre_ProgramaEducativo" 
                  optionValue="clave_ProgramaEducativo"
                  placeholder="Selecciona un Programa Educativo" 
        />
      );
    };

      //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
      case 'clave_Edificio':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
          rowData[field] = newValue; 
          put(rowData);
        }else{
          event.preventDefault();
        }
        break;
      case 'clave_ProgramaEducativo':
        if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
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

return (
 <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Programas Educativo a edificio" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">

          <div className="field col-3">
            <label>Edificio*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_Edificio} 
              options={edificios} 
              onChange={(e) => {
                setclave_Edificio(e.value);
              }} 
              optionLabel="nombre_Edificio" 
              optionValue="clave_Edificio" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione el Edificio" 
            />
          </div>
          <div className="field col-3">
            <label>Programa Educativo*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_ProgramaEducativo} 
              options={programaseducativos} 
              onChange={(e) => {
                setclave_ProgramaEducativo(e.value);
              }} 
              optionLabel="nombre_ProgramaEducativo" 
              optionValue="clave_ProgramaEducativo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Programa Educativo" 
            />
          </div>
                                                                                                    
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
      </Panel>
         {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
  <Panel header="Consultar Programas educativos asignados a edificios" className='mt-3' toggleable>
  <div className="mx-8 mb-4">
    <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
  </div>  
  <DataTable value={filtroUsarEdificio.length ? filtroUsarEdificio :usaredificiolist} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
      {columns.map(({ field, header }) => {
          return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
          editor={field === 'clave_UsarEdificio' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => seteditando(true)}/>;
      })}
    </DataTable>
  </Panel> 
    </>

)

}

export default UsarEdificioo 
 
