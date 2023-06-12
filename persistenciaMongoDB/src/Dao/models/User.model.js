import mongoose from 'mongoose';

const collection = 'User';

const schema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email: { type: String, unique: true },
    age:Number,
    password:String,//hasheada con bcrypt
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carritos", // Utiliza el nombre de la colección del modelo de Carts
    },
    role: {
        type: String,
        default: "user"
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;
