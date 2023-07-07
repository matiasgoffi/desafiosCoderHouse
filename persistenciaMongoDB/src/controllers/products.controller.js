import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import ProductManager from "../Dao/Managers/productManager/ProductManager.js";
import ProductDTO from "../Dao/DTOs/productDTO.js";
import { io } from "../app.js";
import SessionController from "./sessions.controller.js";

const productManager = new ProductManager();
const managerAccess = new ManagerAccess();
const sessioncontroller = new SessionController()
export default class ProductsController{
    getProductsFromPage= async (req, res)=>{
        const Limit = req.params.limit;
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
          const limit = Limit ? Number(Limit) : 10;
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
    }
getProductById = async(req, res) => {
    await managerAccess.crearRegistro("consultar producto");

    const id = req.params.pid;
  
    try {
      const producto = await productManager.getProductsById(id);
      if (producto) {
        const payload = {
          status: "success",
          payload: [producto], // Coloca el producto dentro de un array en el payload
        };
        res.send(payload);
      } else {
        res.status(404).send({ error: "No se encontró el producto" });
      }
    } catch (error) {
      console.log("cannot get product with mongoose: " + error);
      res.status(500).send({ error: "Error al obtener el producto" });
    }

}

createProduct = async (req, res) => {
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

  // Crear instancia del DTO con los valores
  const productDTO = new ProductDTO(
    title,
    description,
    price,
    code,
    status,
    thumbnails,
    stock,
    category
  );

  // Validaciones requeridas
  if (
    !productDTO.title ||
    !productDTO.description ||
    !productDTO.code ||
    !productDTO.price ||
    !productDTO.status ||
    !productDTO.stock ||
    !productDTO.category ||
    !productDTO.thumbnails ||
    !Array.isArray(thumbnails) ||
    !productDTO.thumbnails.every((thumbnail) => typeof thumbnail === "string")) {
    return res.status(400).json({
      error: "Solicitud inválida falta al menos una propiedad requerida",
    });
  }

  try {
    const nuevoProducto = await productManager.addProduct(productDTO);

    // Emitir evento a todos los clientes conectados cuando se agrega un nuevo producto
    io.emit("update", nuevoProducto);

    res.send({ nuevoProducto });
  } catch (error) {
    console.log("cannot add product with mongoose: " + error);
    res.status(500).send({ error: "Error al agregar el producto" });
  }
};

updateProduct= async(req, res)=>{
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
      !price ||
      !code ||
      !status ||
      !thumbnails||
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

}
deleteProduct= async(req,res)=>{
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
}

}