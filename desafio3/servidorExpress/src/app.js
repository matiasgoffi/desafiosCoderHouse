import express from "express";
import ProductManager from "./productManager/ProductManager.js";

const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("Servidor funcionando en el puerto: " + PORT);
});

const path = "./files/DB.json";
const productManager = new ProductManager(path);

app.get("/products", async (req, res) => {
  const limit = req.query.limit; // obtener el valor del parámetro limit de la consulta
  let productos;
  if (limit) {
    productos = await productManager.getProducts(parseInt(limit));
  } else {
    productos = await productManager.getProducts();
  }
  res.send(productos);
});

app.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;

  const producto = await productManager.getProductsById(pid);

  if (!producto) {
    return res.send({ error: `El producto con id ${pid} no existe` });
  }

  res.send(producto);
});
