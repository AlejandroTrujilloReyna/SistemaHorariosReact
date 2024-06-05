import React from 'react';
import { Menubar } from 'primereact/menubar';
import './BarraMenuPersonalizado.css';  // Importa tu archivo CSS personalizado

const Menu = () => {
    const items = [
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Sistema de Planta Academica</span>,
            command: () => { window.location.href = '/'; }
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Entidades Basicas</span>,
            icon: 'pi pi-building-columns',
            items: [
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Unidad Academica</span>,
                    command: () => { window.location.href = '/UnidadAcademica'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Programa Educativo</span>,
                    command: () => { window.location.href = '/ProgramaEducativo'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Plan de Estudios</span>,
                    command: () => { window.location.href = '/PlanEstudios'; }
                }
            ]
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Infraestructura</span>,
            icon: 'pi pi-building',
            items: [
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Edificio</span>,
                    items: [
                        {
                            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Edificios</span>,
                            command: () => { window.location.href = '/Edificio'; }
                        },
                        {
                            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Uso de Edificios</span>,
                            command: () => { window.location.href = '/UsarEdificio'; }
                        }
                    ]
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Sala</span>,
                    command: () => { window.location.href = '/Sala'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Tipo Sala</span>,
                    command: () => { window.location.href = '/TipoSala'; }
                }
            ]
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Gestión de Personal</span>,
            icon: 'pi pi-home',
            items: [
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Usuario</span>,
                    command: () => { window.location.href = '/Usuario'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Tipo Empleado</span>,
                    command: () => { window.location.href = '/TipoEmpleado'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Docente</span>,
                    command: () => { window.location.href = '/Docente'; }
                }
            ]
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Gestión de Actividades</span>,
            icon: 'pi pi-building-columns',
            items: [
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Unidad de Aprendizaje</span>,
                    items: [
                        {
                            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Unidades de Aprendizaje</span>,
                            command: () => { window.location.href = '/UnidadAprendizaje'; }
                        },
                        {
                            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Unidades de Aprendizaje Plan de Estudios</span>,
                            command: () => { window.location.href = '/UnidadAprendizajePlanEstudios'; }
                        }
                    ]
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Actividad</span>,
                    command: () => { window.location.href = '/Actividad'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Horario de Actividad</span>,
                    command: () => { window.location.href = '/HorarioActividad'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Horarios</span>,
                    command: () => { window.location.href = '/Horario'; }
                }                
            ]
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Otros</span>,
            icon: 'pi pi-building',
            items: [
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Tipo de Horas de SubGrupo de Unidad de Aprendizaje</span>,
                    command: () => { window.location.href = '/UATipoSubGrupoHoras'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Tipo SubGrupo</span>,
                    command: () => { window.location.href = '/TipoSubGrupo'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Grado de Estudios</span>,
                    command: () => { window.location.href = '/GradoEstudio'; }
                },
                {
                    label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>SubGrupos</span>,
                    command: () => { window.location.href = '/SubGrupo'; }
                }
            
            ]

        }
    ];

    const start = <img alt="logo" src="https://comunicacioninstitucional.uabc.mx/wp-content/uploads/2024/03/escudo-actualizado-2022-w1000px-751x1024.png" height="40" className="mr-2"></img>;
 
   
    return (
        <>
            <Menubar model={items} start={start} className="custom-menubar" />
        </>
    );
}

export default Menu;