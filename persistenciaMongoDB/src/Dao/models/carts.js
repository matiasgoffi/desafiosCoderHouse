import mongoose from "mongoose";
const cartsCollection = "carritos"; //asi se llamará la colección en la base de datos.

const cartsSchema = new mongoose.Schema({
      products: {
              type: Array,
              default: [],
              required: true, 
            },
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema); //De esta manera exporto mi modelo como productsModel.