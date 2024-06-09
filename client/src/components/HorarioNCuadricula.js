import React, { Fragment, useState, useEffect, useRef } from 'react';
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
import GrupoService from '../services/GrupoService';
import DocenteService from '../services/DocenteService';
import UnidadAprendizajeService from '../services/UnidadAprendizajeService';
import TipoSubGrupoService from '../services/TipoSubGrupoService';
import { validarNumero } from '../services/ValidacionGlobalService';

const HorarioNCuadricula = () => {
  // Variables for registration
  const [clave_Grupo, setclave_Grupo] = useState(null);
  const [clave_UnidadAprendizaje, setclave_UnidadAprendizaje] = useState(null);
  const [no_Empleado_Docente, setno_Empleado_Docente] = useState(null);
  const [clave_TipoSubGrupo, setclave_TipoSubGrupo] = useState(null);
  const [hora_Entrada, sethora_Entrada] = useState('');
  const [hora_Salida, sethora_Salida] = useState('');
  const [clave_Dia, setclave_Dia] = useState(null);
  const [clave_SubGrupo, setclave_SubGrupo] = useState(null);
  const [clave_Sala, setclave_Sala] = useState(null);
  const [capacidad_SubGrupo, setcapacidad_SubGrupo] = useState("");
  // Variables for consultation
  const [horariolist, sethorariolist] = useState([]);
  const [filtrohorario, setfiltrohorario] = useState([]);
  const [dias, setDias] = useState([]);
  const [subgrupos, setSubgrupos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [gruposList, setGrupoList] = useState([]);
  const [docenteList, setdocenteList] = useState([]);
  const [unidadesAprendizajeList, setunidadesAprendizajeList] = useState([]);
  const [tipoSubGrupoList, settipoSubGrupoList] = useState([]);
  // Variable for modification to indicate edit mode
  const [editando, seteditando] = useState(false);
  const [editableRow, setEditableRow] = useState(null);
  // Variables for error handling
  const toast = useRef(null);

  // Function to register
  const add = () => {
    if (!clave_Grupo || !clave_UnidadAprendizaje || !no_Empleado_Docente || !clave_TipoSubGrupo || !capacidad_SubGrupo || !hora_Entrada || !hora_Salida || !clave_Dia || !clave_Sala) {
      mostrarAdvertencia(toast, "Existen campos Obligatorios vacíos");
      return;
    }
    HorarioService.registrarHorarioYSubGrupo({
      clave_Grupo,
      clave_UnidadAprendizaje,
      no_Empleado_Docente,
      clave_TipoSubGrupo,
      capacidad_SubGrupo,
      hora_Entrada,
      hora_Salida,
      clave_Dia,
      clave_Sala
    }).then(response => {
      if (response.status === 200) {
        mostrarExito(toast, "Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error => {
      if (error.response.status === 401) {
        mostrarAdvertencia(toast, "La hora de Salida debe ser posterior a la hora de Entrada");
      } else if (error.response.status === 402) {
        mostrarAdvertencia(toast, "Ya existe un Registro en ese Horario");
      } else if (error.response.status === 500) {
        mostrarError(toast, "Error interno del servidor");
      }
    });
  }

  const addCompleto = () => {
    if (!clave_Grupo || !clave_UnidadAprendizaje || !no_Empleado_Docente || !clave_TipoSubGrupo || !capacidad_SubGrupo || !hora_Entrada || !hora_Salida || !clave_Dia || !clave_Sala) {
      mostrarAdvertencia(toast, "Existen campos Obligatorios vacíos");
      return;
    }
    HorarioService.registrarHorario({
      hora_Entrada,
      hora_Salida,
      clave_Dia,
      clave_SubGrupo,
      clave_Sala
    }).then(response => {
      if (response.status === 200) {
        mostrarExito(toast, "Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error => {
      if (error.response.status === 401) {
        mostrarAdvertencia(toast, "La hora de Salida debe ser posterior a la hora de Entrada");
      } else if (error.response.status === 402) {
        mostrarAdvertencia(toast, "Ya existe un Registro en ese Horario");
      } else if (error.response.status === 500) {
        mostrarError(toast, "Error interno del servidor");
      }
    });
  }

  // Function for consultation
  const get = () => {
    HorarioService.consultaCompletaHorario().then((response) => {
      sethorariolist(response.data);
    }).catch(error => {
      if (error.response.status === 500) {
        // setmensajeError("Error del sistema");
      }
    });
  }

  // Function for modification
  const put = (rowData) => {
    HorarioService.modificarHorario(rowData).then(response => {
      if (response.status === 200) {
        mostrarExito(toast, "Modificación Exitosa");
        get();
      }
    }).catch(error => {
      if (error.response.status === 401) {
        mostrarAdvertencia(toast, "La hora de Salida debe ser posterior a la hora de Entrada");
        get();
      } else if (error.response.status === 402) {
        mostrarAdvertencia(toast, "Ya existe un Registro en ese Horario");
        get();
      } else if (error.response.status === 500) {
        mostrarError(toast, "Error interno del servidor");
      }
    })
  }

  // Function to clear fields after registration
  const limpiarCampos = () => {
    sethora_Entrada("");
    sethora_Salida("");
    setclave_Dia(null);
    setclave_SubGrupo(null);
    setclave_Sala(null);
    setEditableRow(null);
  }

  // Columns for the table
  const columns = [
    { field: 'clave_SubGrupo', header: 'Clave SubGrupo' },
    { field: 'clave_Horario', header: 'Clave Horario' },
    { field: 'clave_UnidadAprendizaje', header: 'Clave Unidad Aprendizaje' },
    { field: 'unidadAprendizaje', header: 'Unidad Aprendizaje' },
    { field: 'no_Empleado_Docente', header: 'NoEmpleado Docente' },
    { field: 'docente', header: 'Docente' },
    { field: 'clave_TipoSubGrupo', header: 'Tipo de SubGrupo' },
    { field: 'capacidad_SubGrupo', header: 'Capacidad' },
    { field: 'hora_Entrada', header: 'Entrada' },
    { field: 'hora_Salida', header: 'Salida' },
    { field: 'clave_Dia', header: 'Día' },
    { field: 'clave_Sala', header: 'Sala' },
    { field: '1', header: 'Lunes' },
    { field: '2', header: 'Martes' },
    { field: '3', header: 'Miercoles' },
    { field: '4', header: 'Jueves' },
    { field: '5', header: 'Viernes' },
    { field: '6', header: 'Sabado' }
  ];

  useEffect(() => {
    get();
  }, []);

  // Function for search bar
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = horariolist.filter((item) => {
      return (
        item.clave_Horario.toString().includes(value) ||
        item.hora_Entrada.toString().includes(value) ||
        item.hora_Salida.toString().includes(value) ||
        item.clave_Dia.toString().includes(value) ||
        item.clave_SubGrupo.toString().includes(value) ||
        item.clave_Sala.toString().includes(value)
      );
    });
    setfiltrohorario(filteredData);
  };

  // Fetch lists of days, groups, teachers, learning units, and sub-group types
  useEffect(() => {
    DiaService.consultarDia()
      .then(response => {
        setDias(response.data);
      })
      .catch(error => {
        console.error("Error fetching dias:", error);
      });
    SalaService.consultarSala()
      .then(response => {
        setSalas(response.data);
      })
      .catch(error => {
        console.error("Error fetching salas:", error);
      });
    GrupoService.consultarGrupo()
      .then(response => {
        setGrupoList(response.data);
      })
      .catch(error => {
        console.error("Error fetching grupos:", error);
      });
    DocenteService.consultarDocente()
      .then(response => {
        setdocenteList(response.data);
      })
      .catch(error => {
        console.error("Error fetching docente:", error);
      });
    UnidadAprendizajeService.consultarUnidadAprendizaje()
      .then(response => {
        setunidadesAprendizajeList(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidad aprendizaje:", error);
      });
    TipoSubGrupoService.consultarTipoSubGrupo()
      .then(response => {
        settipoSubGrupoList(response.data);
      })
      .catch(error => {
        console.error("Error fetching tipo subgrupo:", error);
      });
  }, []);

  const handleEditClick = (rowData) => {
    setEditableRow(rowData);
    seteditando(true);
  }

  const handleSaveClick = () => {
    if (editableRow) {
      put(editableRow);
      seteditando(false);
      setEditableRow(null);
    }
  }

  return (
    <Fragment>
      <Toast ref={toast} />
      <Panel header="Registro de Horario">
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-4">
            <label htmlFor="grupo">Grupo:</label>
            <Dropdown value={clave_Grupo} options={gruposList} optionLabel="nombre" placeholder="Seleccione un grupo" onChange={(e) => setclave_Grupo(e.value)} />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="unidadAprendizaje">Unidad de Aprendizaje:</label>
            <Dropdown value={clave_UnidadAprendizaje} options={unidadesAprendizajeList} optionLabel="nombre" placeholder="Seleccione una unidad de aprendizaje" onChange={(e) => setclave_UnidadAprendizaje(e.value)} />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="docente">Docente:</label>
            <Dropdown value={no_Empleado_Docente} options={docenteList} optionLabel="nombre" placeholder="Seleccione un docente" onChange={(e) => setno_Empleado_Docente(e.value)} />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="tipoSubGrupo">Tipo de Subgrupo:</label>
            <Dropdown value={clave_TipoSubGrupo} options={tipoSubGrupoList} optionLabel="nombre" placeholder="Seleccione un tipo de subgrupo" onChange={(e) => setclave_TipoSubGrupo(e.value)} />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="capacidadSubGrupo">Capacidad de Subgrupo:</label>
            <InputText id="capacidadSubGrupo" value={capacidad_SubGrupo} onChange={(e) => setcapacidad_SubGrupo(validarNumero(e.target.value))} />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="horaEntrada">Hora de Entrada:</label>
            <InputText id="horaEntrada" value={hora_Entrada} onChange={(e) => sethora_Entrada(e.target.value)} />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="horaSalida">Hora de Salida:</label>
            <InputText id="horaSalida" value={hora_Salida} onChange={(e) => sethora_Salida(e.target.value)} />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="dia">Día:</label>
            <Dropdown value={clave_Dia} options={dias} optionLabel="nombre" placeholder="Seleccione un día" onChange={(e) => setclave_Dia(e.value)} />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="sala">Sala:</label>
            <Dropdown value={clave_Sala} options={salas} optionLabel="nombre" placeholder="Seleccione una sala" onChange={(e) => setclave_Sala(e.value)} />
          </div>
        </div>
        <Button label="Registrar" icon="pi pi-check" onClick={add} />
      </Panel>
      <Panel header="Consultar Horarios">
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-6">
            <label htmlFor="search">Buscar:</label>
            <InputText id="search" placeholder="Buscar..." onChange={onSearch} />
          </div>
        </div>
        <DataTable value={filtrohorario.length > 0 ? filtrohorario : horariolist} editable={true}>
          {columns.map(col => (
            <Column key={col.field} field={col.field} header={col.header} body={rowData => (
              rowData.clave_Dia && (
                <div>
                  <span>{rowData.hora_Entrada}</span>
                  <span>{rowData.hora_Salida}</span>
                  <span>{rowData.clave_Sala}</span>
                </div>
              )
            )} editor={(options) => (
              <div>
                <InputText value={options.rowData.hora_Entrada} onChange={(e) => options.editorCallback(e.target.value)} />
                <InputText value={options.rowData.hora_Salida} onChange={(e) => options.editorCallback(e.target.value)} />
                <Dropdown value={options.rowData.clave_Sala} options={salas} onChange={(e) => options.editorCallback(e.value)} optionLabel="nombre" />
              </div>
            )} />
          ))}
        </DataTable>
        {editando && (
          <div>
            <Button label="Guardar" icon="pi pi-check" onClick={handleSaveClick} />
          </div>
        )}
      </Panel>
    </Fragment>
  );
}

export default HorarioNCuadricula;
