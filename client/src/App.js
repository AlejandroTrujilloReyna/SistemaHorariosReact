import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import Menu from './components/Menu';
import UnidadAcademica from './components/UnidadAcademica';
import ProgramaEducativo from './components/ProgramaEducativo';
import Edificio from './components/Edificio';
import Sala from './components/Sala';
import TipoSala from './components/TipoSala';
import UsarEdificio from './components/UsarEdificio';
import UnidadAprendizaje from './components/UnidadAprendizaje';

function App() {
  return (
    <div className="App">
      <Menu/>
      <BrowserRouter>
        <Routes>
          <Route path='/UnidadAcademica' element={<UnidadAcademica/>}/>
          <Route path='/ProgramaEducativo' element={<ProgramaEducativo/>}/>
         <Route path='/UnidadAprendizaje' element={<UnidadAprendizaje/>}/>
          <Route path='/Edificio' element={<Edificio/>}/>
          <Route path='/UsarEdificio' element={<UsarEdificio/>}/>
          <Route path='/Sala' element={<Sala/>}/>
          <Route path='/TipoSala' element={<TipoSala/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
