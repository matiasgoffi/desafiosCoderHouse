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
    },
    documents:{
        type:[
            {
                name: {type:String, required: true}, //nombre del documento
                reference: {type:String, required: true},//link al documento
            }
        ],
        default: []
    },
    last_connection:{
        type: Date,
        default: null
    }, //registro cuando user hace login y logout 
    status: {
        type: String,
        require: true,
        enums:["completo","incompleto","pendiente"],
        default: "pendiente"
    },
    avatar:{
        type: String,
        default:""
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;
