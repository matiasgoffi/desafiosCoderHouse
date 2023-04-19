import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import viewRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js"; //cuando se importa le damos un nombre significativo, em este cas usersRouter y petsRouter
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
    // Aquí puedes realizar las operaciones necesarias con los productos recibidos en el evento "update"
    // Luego, emites el evento "update" con los datos actualizados para que se actualice la lista en el cliente
    io.emit("update", productos);
  });
  // Agrega el evento "delete"
  socket.on("delete", (pid) => {
    io.emit("delete", pid);
  });
});
