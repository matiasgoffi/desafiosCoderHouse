import mongoose from "mongoose";
const messagesCollection = "messages"; //asi se llamará la colección en la base de datos.

const messagesSchema = new mongoose.Schema({
    user: {
        type: String, //este será el correo del usuario
        index: true,
        required: true,
      },
      message: {
        type: String, //mensaje del usuario
        required: true,
      },
});

export const messagesModel = mongoose.model(messagesCollection, messagesSchema); //De esta manera exporto mi modelo como productsModel.