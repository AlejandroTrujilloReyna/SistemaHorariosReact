import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import DocenteService from '../services/DocenteService';
const HorarioN = () => {
  const [horario, setHorario] = useState([]);
  const [docentesList,setdocentesList] = useState([]);
  useEffect(() => {
    DocenteService.consultarDocente().then((response)=>{//CASO EXITOSO
      setdocentesList(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    }); 
    if (horario.length === 0) {
      addRow(0);
    }
  }, []);

  const handleHorarioChange = (index, dia, campo, value) => {
    const newHorario = [...horario];
    newHorario[index][dia][campo] = value;
    setHorario(newHorario);
  };

  const addRow = (index) => {
    const newHorario = [...horario];
    newHorario.splice(index + 1, 0, {
      materia: '',
      maestro: '',
      tipoClase: '',
      numSubgrupo: '',
      lunes: { inicio: '', fin: '', sala: '' },
      martes: { inicio: '', fin: '', sala: '' },
      miercoles: { inicio: '', fin: '', sala: '' },
      jueves: { inicio: '', fin: '', sala: '' },
      viernes: { inicio: '', fin: '', sala: '' },
      sabado: { inicio: '', fin: '', sala: '' }
    });
    setHorario(newHorario);
  };

  const renderTimeCell = (rowIndex, day, field) => {
    return (
      <div style={{ display: 'inline-block', width: '80px', marginRight: '5px' }}>
        <InputText
          type="time"
          value={horario[rowIndex][day][field]}
          onChange={(e) => handleHorarioChange(rowIndex, day, field, e.target.value)}
          className="w-full"
          style={{ width: '100%', minWidth: '60px' }}
        />
      </div>
    );
  };

  const renderInputCell = (rowIndex, day) => {
    return (
      <React.Fragment>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderTimeCell(rowIndex, day, 'inicio')}
          <span>-</span>
          {renderTimeCell(rowIndex, day, 'fin')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <Dropdown
            value={horario[rowIndex][day].sala}
            // options={/* Opciones de salas */}
            onChange={(e) => handleHorarioChange(rowIndex, day, 'sala', e.value)}
            placeholder="Sala"
            style={{ width: '80px' }}
          />
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="container mx-auto px-4" style={{ width: '100%' }}>
      <DataTable value={horario} className="mt-4 w-full" autoLayout={true}>
        <Column
          style={{ width: '60px' }}
          body={(rowData, { rowIndex }) => (
            <Button
              onClick={() => addRow(rowIndex)}
              icon="pi pi-plus"
              className="p-button-rounded p-button-success"
            />
          )}
        />
        <Column
          header="Unidad Aprendizaje Maestro"
          headerStyle={{ textAlign: 'center' }}
          body={(rowData, { rowIndex }) => (
            <div>
              <Dropdown
                value={rowData.materia}
                // options={/* Opciones de materias */}
                onChange={(e) => handleHorarioChange(rowIndex, '', 'materia', e.value)}
                placeholder="Seleccione Materia"
                style={{ width: '100%' }}
                className="mb-2"
              />
              <Dropdown
                value={rowData.maestro}
                options={docentesList}
                onChange={(e) => handleHorarioChange(rowIndex, '', 'maestro', e.value)}
                placeholder="Seleccione Maestro"
                style={{ width: '100%' }}
              />
            </div>
          )}
        />
        <Column
          header="Tipo Clase  No.SubGrupo"
          headerStyle={{ textAlign: 'center' }}
          body={(rowData, { rowIndex }) => (
            <div>
              <Dropdown
                value={rowData.tipoClase}
                // options={/* Opciones de tipo de clase */}
                onChange={(e) => handleHorarioChange(rowIndex, '', 'tipoClase', e.value)}
                placeholder="Seleccione"
                style={{ width: '100%' }}
                className="mb-2"
              />
              <Dropdown
                value={rowData.numSubgrupo}
                // options={/* Opciones de número de subgrupo */}
                onChange={(e) => handleHorarioChange(rowIndex, '', 'numSubgrupo', e.value)}
                placeholder="Seleccione"
                style={{ width: '100%' }}
              />
            </div>
          )}
        />
        <Column field="lunes" header="Lunes" headerStyle={{ textAlign: 'center' }} body={(rowData, { rowIndex }) => renderInputCell(rowIndex, 'lunes')} />
        <Column field="martes" header="Martes" headerStyle={{ textAlign: 'center' }} body={(rowData, { rowIndex }) => renderInputCell(rowIndex, 'martes')} />
        <Column field="miercoles" header="Miércoles" headerStyle={{ textAlign: 'center' }} body={(rowData, { rowIndex }) => renderInputCell(rowIndex, 'miercoles')} />
        <Column field="jueves" header="Jueves" headerStyle={{ textAlign: 'center' }} body={(rowData, { rowIndex }) => renderInputCell(rowIndex, 'jueves')} />
        <Column field="viernes" header="Viernes" headerStyle={{ textAlign: 'center' }} body={(rowData, { rowIndex }) => renderInputCell(rowIndex, 'viernes')} />
        <Column field="sabado" header="Sábado" headerStyle={{ textAlign: 'center' }} body={(rowData, { rowIndex }) => renderInputCell(rowIndex, 'sabado')} />
      </DataTable>
    </div>
  );
};

export default HorarioN;
