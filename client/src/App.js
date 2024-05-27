import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import Menu from './components/Menu';
import UnidadAcademica from './components/UnidadAcademica';
import ProgramaEducativo from './components/ProgramaEducativo';
import Edificio from './components/Edificio';
import Sala from './components/Sala';
import TipoSala from './components/TipoSala';
import UsarEdificio from './components/UsarEdificioo';
import UnidadAprendizaje from './components/UnidadAprendizaje';
import PlanEstudios from './components/PlanEstudios'
import TipoSubGrupo from './components/TipoSubGrupo'
import UATipoSubGrupoHoras from './components/UATipoSubGrupoHoras';
import Usuario from './components/Usuario';
import TipoEmpleado from './components/TipoEmpleado';
import GradoEstudio from './components/GradoEstudio';
import Docente from './components/Docente';
import Actividad from './components/Actividad';
import HorarioActividad from './components/HorarioActividad';
import Inicio from './components/Inicio';
import SalaN from './components/SalaN';
import UsarEdificioo from './components/UsarEdificioo';
import UnidadAprendizajePlanEstudios from './components/UnidadAprendizajePlanEstudios';
function App() {
  return (
    <div className="App">
      <Menu/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Inicio/>}/>
          <Route path='/UnidadAcademica' element={<UnidadAcademica/>}/>
          <Route path='/ProgramaEducativo' element={<ProgramaEducativo/>}/>
          <Route path='/UnidadAprendizaje' element={<UnidadAprendizaje/>}/>
          <Route path='/Edificio' element={<Edificio/>}/>
          <Route path='/UsarEdificio' element={<UsarEdificio/>}/>
          <Route path='/Sala' element={<Sala/>}/>
          <Route path='/SalaN' element={<SalaN/>}/>
          <Route path='/TipoSala' element={<TipoSala/>}/>
          <Route path='/PlanEstudios' element={<PlanEstudios/>}/>
          <Route path='UATipoSubGrupoHoras' element={<UATipoSubGrupoHoras/>}/>
          <Route path='/TipoSubGrupo' element={<TipoSubGrupo/>}/>
          <Route path='/Usuario' element={<Usuario/>}/>
          <Route path='/TipoEmpleado' element={<TipoEmpleado/>}/>
          <Route path='/GradoEstudio' element={<GradoEstudio/>}/>
          <Route path='/Docente' element={<Docente/>}/>
          <Route path='/Actividad' element={<Actividad/>}/>
          <Route path='/HorarioActividad' element={<HorarioActividad/>}/>
          <Route path='/UsarEdificioo' element={<UsarEdificioo/>}/>
          <Route path='/UnidadAprendizajePlanEstudios' element={<UnidadAprendizajePlanEstudios/>}/>
          <Route path='/Inicio' element={<Inicio/>}/>
        
        </Routes>
      </BrowserRouter>    
    </div>
  );
}

export default App;
