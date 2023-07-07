import mongoose from "mongoose";

const cartsCollection = "carritos";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "Product" // Utiliza la misma referencia que definiste en el modelo de productos
      },
      quantity: Number
    }
  ]
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);


