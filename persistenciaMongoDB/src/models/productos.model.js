import mongoose from "mongoose";
const productsCollection = "productos" //asi se llamará la colección en la base de datos.

const  productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: Number,
    status: Boolean,
    thumbnails: String,
    stock: Number,
    category: String,
    id: Number,
}) 

export const productsModel = mongoose.model(productsCollection, productsSchema); //De esta manera exporto mi modelo como productsModel.
