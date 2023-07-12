export const generateProductErrorInfo = (product) => {
    return `
    FALTA ALGUN PARAMETRO PARA CREAR UN PRODUCTO O NO ES VALIDO:
    lista de campos requeridos:
   * title: debe ser un campo string, recibió ${product.title},
   * description: debe ser un campo string, recibió ${product.description},
   * price: debe ser un campo number, recibió ${product.price},
   * code:  debe ser un campo number, recibió ${product.code},
   * status: debe ser un campo booleano, recibió ${product.status},
   * thumbnails: debe ser un campo [strings], recibió ${product.thumbnails},
   * stock:  debe ser un campo number, recibió ${product.stock},
   * category: debe ser un campo string, recibió ${product.category},
    `
}