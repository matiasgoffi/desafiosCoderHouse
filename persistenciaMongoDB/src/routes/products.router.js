import { Router } from "express";
import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import { productsModel } from "../Dao/models/products.js"; //import el modelo ahora puedo acceder a el.
import ProductManager from "../Dao/Managers/productManager/ProductManager.js";
import { io } from "../app.js";

const router = Router();

//const path = "./files/productos.json";
const productManager = new ProductManager();
const managerAccess = new ManagerAccess();

// ruta GET products with mongoose
router.get("/:pid?", async (req, res) => {
  const pid = req.params.pid;
  const page = req.query.page || 1;
  const category = req.query.category;
  let status = req.query.status;
  let sort = req.query.sort;

  // Verificar si sort es un número o no es "asc" ni "desc"
  if (typeof sort !== "string" || (sort !== "asc" && sort !== "desc")) {
    sort = "asc"; // Establecer valor predeterminado
  }

  try {
    await managerAccess.crearRegistro("consultar todos los productos");
    const limit = pid ? Number(pid) : 10;
    const result = await productManager.getProducts(
      category,
      status,
      sort,
      limit,
      page
    );

    const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } =
      result;

    const payload = {
      status: "success",
      payload: docs,
      totalPage: totalPages,
      currentPage: page, // Agregar la página actual
      nextPage,
      prevPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?page=${prevPage}` : null,
      nextLink: hasNextPage ? `/api/products?page=${nextPage}` : null,
    };

    res.send( payload);
  } catch (error) {
    console.log("cannot get products with mongoose: " + error);
    const payload = {
      status: "error",
      error: "Error al obtener los productos",
    };
    res.status(500).send(payload);
  }
});

// ruta GET products by id with mongoose
router.get("/:pid", async (req, res) => {
  await managerAccess.crearRegistro("consultar producto");

  const id = req.params.pid;

  try {
    const producto = await productManager.getProductsById(id);
    if (producto) {
      res.send({ producto });
    } else {
      res.status(404).send({ error: "No se encontró el producto" });
    }
  } catch (error) {
    console.log("cannot get product with mongoose: " + error);
    res.status(500).send({ error: "Error al obtener el producto" });
  }
});

// ruta POST products with mongoose
router.post("/", async (req, res) => {
  await managerAccess.crearRegistro("alta de producto");

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
    !category ||
    !thumbnails ||
    !Array.isArray(thumbnails) ||
    !thumbnails.every((thumbnail) => typeof thumbnail === "string")
  ) {
    return res
      .status(400)
      .json({
        error: "Solicitud inválida falta al menos una propiedad querida",
      });
  }

  try {
    const nuevoProducto = await productManager.addProduct(
      title,
      description,
      price,
      code,
      status,
      thumbnails,
      stock,
      category
    );

    // Emitir evento a todos los clientes conectados cuando se agrega un nuevo producto
    io.emit("update", nuevoProducto);

    res.send({ nuevoProducto });
  } catch (error) {
    console.log("cannot add product with mongoose: " + error);
    res.status(500).send({ error: "Error al agregar el producto" });
  }
});

//ruta PUT actualizar producto with mongoose
router.put("/:pid", async (req, res) => {
  await managerAccess.crearRegistro("actualiza un producto");
  const id = req.params.pid;
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
  if (!id) {
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
  }
  try {
    const productoActualizado = await productManager.updateProduct(
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

    if (!productoActualizado) {
      return res.status(404).json({ error: "El producto no existe" });
    }

    res.send({ productoActualizado });
  } catch (error) {
    console.log("Error al actualizar el producto: " + error);
    res.status(500).send({ error: "Error al actualizar el producto" });
  }
});

// ruta DELETE product with mongoose
router.delete("/:pid", async (req, res) => {
  await managerAccess.crearRegistro("eliminar producto");

  const id = req.params.pid;

  try {
    const productoEliminado = await productManager.deleteProduct(id);

    if (!productoEliminado) {
      return res.status(404).json({ error: "El producto no existe" });
    }

    res.send(`producto con id ${id} eliminado exitosamente`);
  } catch (error) {
    console.log("cannot delete product with mongoose: " + error);
    res.status(500).send({ error: "Error al eliminar el producto" });
  }
});

export default router;
