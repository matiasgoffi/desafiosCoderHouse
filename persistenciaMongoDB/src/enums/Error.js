const EError = {
    ROUTING_ERROR: 1, //ruta no existe
    DATABASE_ERROR: 2, //error con la base de datos
    INVALID_JSON:3, //json invalido en una peticion
    AUTH_ERROR: 4, //error de autenticacion
    INVALID_PARAM: 5 //error de parametros de la ruta
}
export default EError;