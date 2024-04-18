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
import UnidadAprendizaje from './components/UnidadAprendizaje';
import Edificio from './components/Edificio';
import Sala from './components/Sala';
//import Axios from "axios";

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
          <Route path='/Sala' element={<Sala/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
