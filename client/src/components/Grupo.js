import React, { useState, useEffect, useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ToggleButton } from 'primereact/togglebutton';
import { Toast } from 'primereact/toast';
import PlanEstudiosService from '../services/PlanEstudiosService';
import GrupoService from '../services/GrupoService';

const Grupo = () => {
    const [clave_Grupo, setclave_Grupo] = useState(0);
    const [nombre_Grupo, setnombre_Grupo] = useState("");
    const [semestre, setsemestre] = useState(0);
    const [clave_PlanEstudios, setclave_PlanEstudios] = useState(null);
    const [uso, setuso] = useState(1);

    const [planesestudio, setplanesestudio] = useState([]);
    const [grupoList, setgrupoList] = useState([]);
    const [filtrogrupo, setfiltrogrupo] = useState([]);

    const toast = useRef(null);
    const [editando, seteditando] = useState(false);

    //MENSAJE DE EXITO
    const mostrarExito = (mensaje) => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensaje, life: 3000 });
    }
    //MENSAJE DE ADVERTENCIA
    const mostrarAdvertencia = (mensaje) => {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: mensaje, life: 3000 });
    }
    //MENSAJE DE ERROR
    const mostrarError = (mensaje) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
    }

    //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
    const limpiarCampos = () => {
        setclave_Grupo(0);
        setnombre_Grupo("");
        setsemestre(0);
        setclave_PlanEstudios(null);
        setuso(1);
    };

    //FUNCION PARA REGISTRAR
    const add = () => {
        //VALIDACION DE CAMPOS VACIOS
        if (!clave_Grupo || !nombre_Grupo || !semestre || !clave_PlanEstudios) {
            mostrarAdvertencia("Existen campos obligatorios vacíos");
            return;
        }
        //MANDAR A LLAMAR AL REGISTRO SERVICE
        GrupoService.registrarGrupo({
            clave_Grupo: clave_Grupo,
            nombre_Grupo: nombre_Grupo,
            semestre: semestre,
            clave_PlanEstudios: clave_PlanEstudios,
            uso: uso,
        }).then(response => {//CASO EXITOSO
            if (response.status === 200) {
                mostrarExito("Registro exitoso");
                get();
                limpiarCampos();
            }
        }).catch(error => {//EXCEPCIONES
            if (error.response && error.response.status === 401) {
                mostrarAdvertencia("Nombre ya existente en el Grupo");
            } else if (error.response && error.response.status === 500) {
                mostrarError("Error interno del servidor");
            }
        })
    }

    const get = () => {
        GrupoService.consultarGrupo().then((response) => {
            setgrupoList(response.data);
        }).catch(error => {
            if (error.response && error.response.status === 500) {
                mostrarError("Error interno del servidor");
            }
        });
    }

    const put = (rowData) => {
        GrupoService.modificarGrupo(rowData).then((response) => {//CASO EXITOSO
            if (response.status === 200) {
                mostrarExito("Modificación exitosa");
                get();
            }
        }).catch(error => {//EXCEPCIONES
            if (error.response && error.response.status === 401) {
                mostrarAdvertencia("El nombre ya se encuentra registrado");
                get();
            } else if (error.response && error.response.status === 500) {
                mostrarError("Error del sistema");
            }
        });
    }

    const columns = [
        { field: 'clave_Grupo', header: 'Clave' },
        { field: 'nombre_Grupo', header: 'Nombre' },
        { field: 'semestre', header: 'Semestre' },
        { field: 'clave_PlanEstudios', header: 'Clave Plan Estudios' },
        { field: 'uso', header: 'Uso' },
    ];

    useEffect(() => {
        get();
    }, []);

    //FUNCION PARA LA BARRA DE BUSQUEDA
    const onSearch = (e) => {
        const value = e.target.value.toLowerCase();
        const filteredData = grupoList.filter((item) => {
            return (
                item.nombre_Grupo.toLowerCase().includes(value) ||
                item.clave_PlanEstudios.toString().includes(value) ||
                item.semestre.toString().includes(value) ||
                item.clave_Grupo.toString().includes(value)
            );
        });
        setfiltrogrupo(filteredData);
    };

    const renderBody = (rowData, field) => {
        if (field === 'clave_PlanEstudios') {
            const plan = planesestudio.find((plan) => plan.clave_PlanEstudios === rowData.clave_PlanEstudios);
            return plan ? `${plan.nombre_PlanEstudios}` : '';
        } else {
            return rowData[field];
        }
    };

    const validarTexto = (value) => {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(value);
    };

    const validarNumero = (value) => {
        const regex = /^[0-9]\d*$/;
        return value === '' || regex.test(value);
    };

    useEffect(() => {
        PlanEstudiosService.consultarPlanestudios()
            .then(response => {
                setplanesestudio(response.data);
            })
            .catch(error => {
                console.error("Error fetching planes estudio:", error);
            });
    }, []);

    const cellEditor = (options) => {
        switch (options.field) {
            case 'nombre_Grupo':
                return textEditor(options);
            case 'semestre':
                return numberEditor(options);
            case 'uso':
                return UsoEditor(options);
            case 'clave_PlanEstudios':
                return PlanEstudiosEditor(options);
            default:
                return textEditor(options);
        }
    };

    const textEditor = (options) => {
        return (
            <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={options.value} maxLength={255}
                onChange={(e) => {
                    if (validarTexto(e.target.value)) {
                        options.editorCallback(e.target.value)
                    }
                }}
                onKeyDown={(e) => e.stopPropagation()} />
        );
    };

    const numberEditor = (options) => {
        return (
            <InputText keyfilter="int" type="text" maxLength={11} value={options.value}
                onChange={(e) => {
                    if (validarNumero(e.target.value)) {
                        options.editorCallback(e.target.value)
                    }
                }} onKeyDown={(e) => e.stopPropagation()} />
        );
    };

    const PlanEstudiosEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={planesestudio}
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel={(option) => `${option.clave_PlanEstudios} - ${option.nombre_PlanEstudios}`}
                optionValue="clave_PlanEstudios"
                placeholder="Seleccione un Plan de Estudios"
            />
        );
    };

    const UsoEditor = (options) => {
        return (
            <ToggleButton
                onLabel="Sí"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                checked={options.value === 1}
                onChange={(e) => options.editorCallback(e.value ? 1 : 0)}
                className="w-8rem"
            />
        );
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        switch (field) {
            //CADA CAMPO QUE SE PUEDA MODIFICAR ES UN CASO
            case 'nombre_Grupo':
                if (newValue.trim().length > 0 && newValue !== rowData[field]) {
                    rowData[field] = newValue; put(rowData);
                } else {
                    event.preventDefault();
                }
                break;
            case 'semestre':
                if (newValue > 0 && newValue !== null && newValue !== rowData[field]) {
                    rowData[field] = newValue; put(rowData);
                } else {
                    event.preventDefault();
                }
                break;
            case 'uso':
                if (newValue !== '' && newValue !== null && newValue !== rowData[field]) {
                    rowData[field] = newValue; put(rowData);
                } else {
                    event.preventDefault();
                }
                break;
            case 'clave_PlanEstudios':
                if (newValue > 0 && newValue !== null && newValue !== rowData[field]) {
                    rowData[field] = newValue; put(rowData);
                } else {
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
            <Toast ref={toast} />
            <Panel header="Registrar Grupo" className='mt-3' toggleable>
                <div className="formgrid grid mx-8">
                    <div className="field col-2">
                        <label>Clave*</label>
                        <InputText type="text" keyfilter="pint" value={clave_Grupo} maxLength={11}
                            onChange={(event) => {
                                if (validarNumero(event.target.value)) {
                                    setclave_Grupo(event.target.value);
                                }
                            }}
                            placeholder="Ej.40"
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
                    </div>

                    <div className="field col-3">
                        <label>Nombre*</label>
                        <InputText type="text" keyfilter={/^[0-9a-zA-Z]*$/} value={nombre_Grupo} maxLength={255}
                            onChange={(event) => {
                                if (validarTexto(event.target.value)) {
                                    setnombre_Grupo(event.target.value);
                                }
                            }}
                            placeholder="Nombre"
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
                    </div>

                    <div className="field col-2">
                        <label>Semestre*</label>
                        <InputText type="text" keyfilter="pint" value={semestre} maxLength={11}
                            onChange={(event) => {
                                if (validarNumero(event.target.value)) {
                                    setsemestre(event.target.value);
                                }
                            }}
                            placeholder="Ej.40"
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
                    </div>

                    <div className="field col-5">
                        <label>Plan Estudios*</label>
                        <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            value={clave_PlanEstudios}
                            options={planesestudio}
                            onChange={(e) => {
                                setclave_PlanEstudios(e.value);
                            }}
                            optionLabel="nombre_PlanEstudios"
                            optionValue="clave_PlanEstudios"
                            placeholder="Seleccione un Plan de Estudios"
                        />
                    </div>

                    <div className="field col-2">
                        <label>Uso*</label>
                        <ToggleButton
                            onLabel="Sí"
                            onIcon="pi pi-check"
                            offIcon="pi pi-times"
                            checked={uso === 1}
                            onChange={(e) => setuso(e.value ? 1 : 0)}
                            className="w-8rem"
                        />
                    </div>
                </div>
                <div className="mx-8 mt-4">
                    <Button label="Guardar" onClick={add} className="p-button-success" />
                </div>
            </Panel>
            <Panel header="Consultar Grupos" className='mt-3' toggleable>
                <div className="mx-8 mb-4">
                    <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />
                </div>
                <DataTable value={filtrogrupo.length ? filtrogrupo : grupoList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
                    {columns.map(({ field, header }) => {
                        return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
                            editor={field === 'clave_Grupo' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => seteditando(true)} />;
                    })}
                </DataTable>
            </Panel>
        </>
    )
}

export default Grupo;
