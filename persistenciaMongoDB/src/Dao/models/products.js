import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productsCollection = "productos"; //asi se llamará la colección en la base de datos.

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  code: {
    type: Number,
    require: true,
    index: true,
  },
  status: {
    type: Boolean,
    require: true,
    index: true,
  },
  thumbnails: {
    type: [String],
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  
});

productsSchema.plugin(mongoosePaginate) //conecto mi modelo con el Plugin reactPaginate

export const productsModel = mongoose.model(productsCollection, productsSchema); //De esta manera exporto mi modelo como productsModel.
