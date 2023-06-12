import mongoose from "mongoose";

const productCollection = "Product";

const productSchema = new mongoose.Schema({
  // Propiedades del producto

});

export const productModel = mongoose.model(productCollection, productSchema);