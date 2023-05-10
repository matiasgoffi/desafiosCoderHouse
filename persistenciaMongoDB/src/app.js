import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import viewRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js"; //cuando se importa le damos un nombre significativo, em este caso usersRouter y petsRouter
import cartsRouter from "./routes/carts.router.js";
import { messagesModel } from "./Dao/models/messages.js";
import mongoose from "mongoose"; //importo Mongoose para conectar la aplicacion a la base de datos como servicio.

const PORT = 8080;
const MONGO =
  "mongodb+srv://matiasgoffi:rugido33@cluster0.e9a5uqp.mongodb.net/ecommerce"; //?retryWrites=true&w=majority
const app = express(); //middleware a nivel de aplicacion

app.use(express.json()); //middleware a nivel de aplicacion
app.use(urlencoded({ extended: true })); //middleware a nivel de aplicacion

app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const server = app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});

//chat socket.io
export const io = new Server(server);

const logs = [];
io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("update", (productos) => {
    // operaciones necesarias para evento "update"
    //emito el evento "update"
    io.emit("update", productos);
  });
  // evento "delete"
  socket.on("delete", (pid) => {
    io.emit("delete", pid);
  });
  //mensaje del chat
  socket.on("message", (data) => {
    const newMessage = new messagesModel({
      user: data.email,
      message: data.message,
    });

    newMessage
      .save()
      .then((savedMessage) => {
        console.log("Mensaje guardado en la base de datos:", savedMessage);
      })
      .catch((err) => {
        console.error("Error al guardar el mensaje:", err);
      });

    logs.push({
      socketid: socket.id,
      email: data.email,
      message: data.message,
    });
    io.emit("log", { logs });
  });
});

//conectando al servidor de Mongo Atlas

const conection = mongoose.connect(MONGO);
