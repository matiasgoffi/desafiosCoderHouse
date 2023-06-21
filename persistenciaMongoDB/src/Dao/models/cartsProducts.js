import mongoose from "mongoose";



const productSchema = new mongoose.Schema({
  // Propiedades del producto


});

// Registra el modelo "Product" en Mongoose
export const Product = mongoose.model('Product', productSchema);

