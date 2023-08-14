import express, { urlencoded } from "express";
import passport from 'passport';
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import sessionRouter from './routes/sessions.router.js';
import viewRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js"; //cuando se importa le damos un nombre significativo, em este caso usersRouter y petsRouter
import cartsRouter from "./routes/carts.router.js";
import mockingRouter from "./routes/mocking.router.js";
import loggerRouter from "./routes/loggers.router.js";
import { messagesModel } from "./Dao/models/messages.js";
import mongoose from "mongoose"; //importo Mongoose para conectar la aplicacion a la base de datos como servicio.
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport.config.js';
import { config } from "./config/config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { addLogger } from "./utils/logger.js";
import { usersRouter } from "./routes/users.router.js";
import { swaggerspecs } from "./config/docConfig.js";
import swaggerUi from "swagger-ui-express";

const PORT = config.server.port;
const MONGO =config.mongo.url;

const app = express(); //middleware a nivel de aplicacion

//WINSTON LOGGER
app.use(addLogger);

//conecto el servidor con el sistema de storage de sesiones de mongo
app.use(session({
  store: new MongoStore({
      mongoUrl: MONGO,
      ttl:3600
  }),
  secret:config.mongo.secret,
  resave:false,
  saveUninitialized:false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); //middleware a nivel de aplicacion
app.use(urlencoded({ extended: true })); //middleware a nivel de aplicacion

app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");



app.use("/", viewRouter);
app.use("/", mockingRouter);
app.use("/", loggerRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/session', sessionRouter);
app.use("/api/users", usersRouter);
//ruta para veer la documentacion de swagger
app.use("/api/docs", swaggerUi.serve,swaggerUi.setup(swaggerspecs));
app.use(errorHandler)


//app.use('/api/session/current', sessionRouter);

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

//funcion asincronica cpara ejecutar agreggates, dentor tiene la connection con MONGO 
const bdMongo = async () => {
    
    
const conection = mongoose.connect(MONGO);
  //aca va la logica de los agreggate

}
bdMongo();

export {app};