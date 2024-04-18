import React from 'react'
import { Menubar } from 'primereact/menubar';

const Menu = () => {
    const items = [
        {
            label: 'Sistema de gestion de horarios',
        },
        {
            label: 'Unidad Academica',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/UnidadAcademica';}
        },             
        {
            label: 'Programa Educativo',
            icon: 'pi pi-briefcase',
            command: () => {window.location.href='/ProgramaEducativo';}
        },
        {
            label: 'Unidad de Aprendizaje',
            icon: 'pi pi-book',
            command: () => {window.location.href='/UnidadAprendizaje';}
        },
        {
            label: 'Edificio',
            icon: 'pi pi-building',
            command: () => {window.location.href='/Edificio';}
        },
        {
            label: 'Sala',
            icon: 'pi pi-home',
            command: () => {window.location.href='/Sala';}
        },                    
    ];
    const start = <img alt="logo" src="https://comunicacioninstitucional.uabc.mx/sites/default/files/inline-images/escudo-actualizado-2022.png" height="40" className="mr-2"></img>;         
  return (
    <>
        <Menubar model={items} start={start}/>                              
    </>
  )
}

export default Menu