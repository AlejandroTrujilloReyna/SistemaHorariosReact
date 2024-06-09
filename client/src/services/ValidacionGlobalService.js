export const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return  regex.test(value);
};

export const validarNumero = (value) => {
    // Expresión regular para validar números enteros positivos
    const regex = /^[0-9]\d*$/;
    // Verificar si el valor coincide con la expresión regular
    return value==='' || regex.test(value);
};

export const validarAlfanumerico = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[0-9a-zA-Z\-/]*$/;
    // Verificar si el valor coincide con la expresión regular
    return regex.test(value); 
};
export const validarCorreo = (value) => {
    // Expresión regular para validar el formato de un correo electrónico
    const regex = /^[a-zA-Z0-9\s@.]*$/;
    // Verificar si el correo coincide con la expresión regular
    return value==='' || regex.test(value);
  //FUNCION PARA ACTIVAR EL FILTRADO

  }; 