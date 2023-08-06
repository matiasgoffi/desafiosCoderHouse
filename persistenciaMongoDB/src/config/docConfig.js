import __dirname from "../utils.js";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";


const swaggerOptions = {
        definition: {
            openapi: "3.0.1",
            info:{
                title: "Documentacion e-commerce",
                version: "1.0.0",
                description: "Definicion de endpoints para la api del ecommerce"
            }
        },
        apis:[`${path.join(__dirname,"/docs/**/*.yaml")}`] //archivos de configuración.

}

//variable que interpreta las opciones
export const swaggerspecs = swaggerJSDoc(swaggerOptions);

