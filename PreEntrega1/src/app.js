import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import viewRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js"; //cuando se importa le damos un nombre significativo, em este caso usersRouter y petsRouter
import cartsRouter from "./routes/carts.router.js";

const PORT = 8080;
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
});
