// src/services/toastService.js

export const mostrarExito = (toast, mensaje) => {
    toast.current.show({severity: 'success', summary: 'Exito', detail: mensaje, life: 3000});
};

export const mostrarAdvertencia = (toast, mensaje) => {
    toast.current.show({severity: 'warn', summary: 'Advertencia', detail: mensaje, life: 3000});
};

export const mostrarError = (toast, mensaje) => {
    toast.current.show({severity: 'error', summary: 'Error', detail: mensaje, life: 3000});
};

export const mostrarInformacion = (toast, mensaje) => {
    toast.current.show({severity: 'info', summary: 'Detalle', detail: mensaje, life: 3000});
};
