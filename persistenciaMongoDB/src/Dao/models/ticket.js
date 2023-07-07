import mongoose from "mongoose";

const ticketsCollection = "tickets"; //asi se llamará la colección en la base de datos.

const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    //required: true,
  },
  amount: {
    type: Number,
    //required: true,
  },
  purchaser: {
    type: String,
    required: false,
  },
});

export const Ticket = mongoose.model(ticketsCollection, ticketsSchema);