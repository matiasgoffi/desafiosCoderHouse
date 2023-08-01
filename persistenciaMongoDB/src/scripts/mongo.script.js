import { productsModel } from "../Dao/models/products.js";
import {connectDB} from "../config/dbConnection.js";

connectDB();

//funcion para agregar el owner a cada producto
const updateProducts = async() =>{
    try {
     const adminId = "_ID del Admin"
        const result = await productsModel.updateMany({},{$set:{owner:adminId}})
        console.log("Result", result)

    } catch (error) {
        console.log(error.message)
    }
}
updateProducts();


