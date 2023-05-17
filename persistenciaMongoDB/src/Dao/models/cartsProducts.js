import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  // Propiedades del producto

});

export const productModel = mongoose.model("Product", productSchema);