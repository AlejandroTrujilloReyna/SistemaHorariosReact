import React from 'react'
import { Menubar } from 'primereact/menubar';

const Menu = () => {
    const items = [
        {
            label: 'Sistema de gestion de horarios',
            command: () => {window.location.href='/';}
        },
  
        {
            label: 'Entidades Básicas',
            icon: 'pi pi-building-columns',
            items: [
                { label: 'Unidad Académica', command: () => {window.location.href='/UnidadAcademica';} },
                { label: 'Programa Educativo', command: () => {window.location.href='/ProgramaEducativo';} },
                { label: 'Plan de Estudios', command: () => {window.location.href='/PlanEstudios';} }
            ]
        },
        {
            label: 'Infraestructura',
            icon: 'pi pi-building',
            items: [
                {
                    label: 'Edificio',
                    items: [
                        { label: 'Edificios', command: () => {window.location.href='/Edificio';} },
                        { label: 'Uso de Edificios', command: () => {window.location.href='/UsarEdificio';} }
                    ]
                },
                { label: 'Sala', command: () => {window.location.href='/Sala';} },
                { label: 'Tipo Sala', command: () => {window.location.href='/TipoSala';} }
            ]
        },
        {
            label: 'Gestión de Personal',
            icon: 'pi pi-home',
            items: [
                { label: 'Usuario', command: () => {window.location.href='/Usuario';} },
                { label: 'Tipo de Empleado', command: () => {window.location.href='/TipoEmpleado';} },
                { label: 'Docente', command: () => {window.location.href='/Docente';} }
            ]
        },
        {
            label: 'Gestión de Actividades',
            icon: 'pi pi-building-columns',
            items: [
                { label: 'Unidad de Aprendizaje', command: () => {window.location.href='/UnidadAprendizaje';} },
                { label: 'Actividad', command: () => {window.location.href='/Actividad';} },
                { label: 'Horario de Actividad', command: () => {window.location.href='/HorarioActividad';} }
            ]
        },
        {
            label: 'Otros',
            icon: 'pi pi-building',
            items: [
                { label: 'UA Tipo SubGrupo Horas', command: () => {window.location.href='/UATipoSubGrupoHoras';} },
                { label: 'Tipo SubGrupo', command: () => {window.location.href='/TipoSubGrupo';} },
                { label: 'Grado de Estudios', command: () => {window.location.href='/GradoEstudio';} }
            ]
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