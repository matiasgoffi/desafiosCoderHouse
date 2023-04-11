import { Router } from "express";
import ProductManager from "../productManager/ProductManager.js";

const router = Router();

const path = "./files/productos.json";
const productManager = new ProductManager(path);

//ruta GET products
router.get("/", async (req, res) => {
  const limit = req.query.limit; // obtener el valor del parámetro limit de la consulta
  let productos;
  if (limit) {
    productos = await productManager.getProducts(parseInt(limit));
  } else {
    productos = await productManager.getProducts();
  }
  res.status(200).json(productos);
});

//ruta GET products by id
router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;

  const producto = await productManager.getProductsById(pid);

  if (!producto) {
    return res.send({ error: `El producto con id ${pid} no existe` });
  }
  res.status(200).json(producto);
});

//ruta POST products
router.post("/", async (req, res) => {
  const {
    title,
    description,
    price,
    code,
    status,
    thumbnails,
    stock,
    category,
  } = req.body;

  // Validaciones requeridas
  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category
  ) {
    return res
      .status(400)
      .json({ error: "Faltan campos requeridos en la solicitud" });
  }
  if (typeof title !== "string") {
    return res
      .status(400)
      .json({ error: "el titulo debe ser una cadena de texto" });
  }
  if (typeof description !== "string") {
    return res
      .status(400)
      .json({ error: "la descripcion debe ser una cadena de texto" });
  }
  if (typeof code !== "string") {
    return res
      .status(400)
      .json({ error: "el código del producto debe ser una cadena de texto" });
  }
  if (typeof price !== "number") {
    return res
      .status(400)
      .json({ error: "el precio del producto debe ser numerico" });
  }
  if (typeof status !== "boolean") {
    return res
      .status(400)
      .json({ error: "el estado del producto debe ser booleano" });
  }
  if (typeof stock !== "number") {
    return res
      .status(400)
      .json({ error: "el stock del producto debe ser numerico" });
  }
  if (typeof category !== "string") {
    return res.status(400).json({
      error: "la categoria del producto debe ser una cadena de texto",
    });
  }
  if (!Array.isArray(thumbnails)) {
    return res
      .status(400)
      .json({ error: "thumbnails debe ser un arreglo de strings" });
  }
  if (!thumbnails.every((thumbnail) => typeof thumbnail === "string")) {
    return res
      .status(400)
      .json({ error: "thumbnails debe ser un arreglo de strings" });
  } else {
    const producto = await productManager.addProduct(
      title,
      description,
      price,
      code,
      status,
      thumbnails,
      stock,
      category
    );

    res.status(200).json({ message: `Producto  agregado correctamente` });
  }
});

//ruta PUT actualizar producto
router.put("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const idProducto = await productManager.getProductsById(pid);
  const {
    title,
    description,
    price,
    code,
    status,
    thumbnails,
    stock,
    category,
  } = req.body;

  // Validaciones requeridas
  if (!idProducto) {
    return res
      .status(400)
      .json({ error: `El producto con id ${pid} no existe` });
  }
  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category
  ) {
    return res
      .status(400)
      .json({ error: "Faltan campos requeridos en la solicitud" });
  }
  if (typeof title !== "string") {
    return res
      .status(400)
      .json({ error: "el titulo debe ser una cadena de texto" });
  }
  if (typeof description !== "string") {
    return res
      .status(400)
      .json({ error: "la descripcion debe ser una cadena de texto" });
  }
  if (typeof code !== "string") {
    return res
      .status(400)
      .json({ error: "el código del producto debe ser una cadena de texto" });
  }
  if (typeof price !== "number") {
    return res
      .status(400)
      .json({ error: "el precio del producto debe ser numerico" });
  }
  if (typeof status !== "boolean") {
    return res
      .status(400)
      .json({ error: "el estado del producto debe ser booleano" });
  }
  if (typeof stock !== "number") {
    return res
      .status(400)
      .json({ error: "el stock del producto debe ser numerico" });
  }
  if (typeof category !== "string") {
    return res.status(400).json({
      error: "la categoria del producto debe ser una cadena de texto",
    });
  }
  if (!Array.isArray(thumbnails)) {
    return res
      .status(400)
      .json({ error: "thumbnails debe ser un arreglo de strings" });
  }
  if (!thumbnails.every((thumbnail) => typeof thumbnail === "string")) {
    return res
      .status(400)
      .json({ error: "thumbnails debe ser un arreglo de strings" });
  } else {
    const id = parseInt(pid);
    const producto = await productManager.updateProduct(
      id,
      title,
      description,
      price,
      code,
      status,
      thumbnails,
      stock,
      category
    );

    res
      .status(200)
      .json({ message: `Producto con id ${pid} actualizado correctamente` });
  }
});

//ruta DELETE product
router.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);

  const idṔroducto = await productManager.getProductsById(pid);

  if (!idṔroducto) {
    return res
      .status(400)
      .json({ error: `El producto con id ${pid} no existe` });
  } else {
    await productManager.deleteProduct(pid);
    res
      .status(200)
      .json({ message: `Producto con id ${pid} eliminado correctamente` });
  }
});

export default router;
