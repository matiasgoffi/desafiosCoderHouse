export const generateProductErrorParamsInfo = (pid) => {
    return `
       ERROR AL RECIBIR EL ID DEL PRODUCTO: 
       * product id: Se espera un valor numerico y existente en la base de datos, se recibió ${pid}.
    `
}