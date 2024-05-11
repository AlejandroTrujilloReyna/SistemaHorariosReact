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
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/UnidadAprendizaje';}
        }, 

        {
            label: 'Edificio',
            icon: 'pi pi-building',
            items: [
                {
                    label: 'Edificios',
                    command: () => {window.location.href='/Edificio';}                 
                },                
                {
                    label: 'Uso de Edificios',
                    command: () => {window.location.href='/UsarEdificio';}                    
                },
            ]
        },
     
        {
            label: 'Sala',
            icon: 'pi pi-home',
            command: () => {window.location.href='/Sala';}

        },
     
        {
            label: 'Tipo Sala',
            icon: 'pi pi-home',
            command: () => {window.location.href='/TipoSala';}
        },                    
      
        {
            label: 'Plan de Estudios',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/PlanEstudios';}
        },
        {
        
            label: 'Tipo SubGrupo',
            icon: 'pi pi-building',
            items: [
                {
                    label: 'UA Tipo SubGrupo Horas',
                    command: () => {window.location.href='/UATipoSubGrupoHoras';}                 
                },                
                {
                    label: 'Tipo SubGrupo',
                    command: () => {window.location.href='/TipoSubGrupo';}                    
                },
            ]
        },
        {
            label: 'Usuario',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/Usuario';}
        },
        {
            label: 'Tipo de Empleado',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/TipoEmpleado';}
        },
        {
            label: 'Grado de Estudios',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/GradoEstudio';}
        }, 
        {
            label: 'Docente',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/Docente';}
        }                
    ];
    const start = <img alt="logo" src="https://comunicacioninstitucional.uabc.mx/sites/default/files/inline-images/escudo-actualizado-2022.png" height="40" className="mr-2"></img>;         
  return (
    <>
        <Menubar model={items} start={start}/>                              
    </>
  )
}

export default Menu