import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import ProductManager from "../Dao/Managers/productManager/ProductManager.js";
import ProductDTO from "../Dao/DTOs/productDTO.js";
import { io } from "../app.js";
import SessionController from "./sessions.controller.js";
import  CustomError  from "../services/customError.services.js";
import EError  from "../enums/Error.js";
import { generateProductErrorInfo } from "../services/productErrorInfo.js";
import { generateProductErrorParamsInfo } from "../services/productErrorParams.js";
import { currentUser } from "./sessions.controller.js";
import {errorHandler} from "../middlewares/errorHandler.js";

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
          req.logger.error(`error al obtener productos: ${error}`)
          const payload = {
            status: "error",
            error: "Error al obtener los productos",
          };
          res.status(500).send(payload);
        }
    }
getProductById = async(req, res, next) => {
    await managerAccess.crearRegistro("consultar producto");

    const id = req.params.pid;
    try {
    const productid = parseInt(id);
    if (Number.isNaN(productid)){
     let error =  CustomError.createError({
        name: "id del producto incorrecto",
        cause: generateProductErrorParamsInfo(id),
        message: "Error obteniendo el producto por id",
        errorCode: EError.INVALID_PARAM,
      })
      res.status(400).send({ error: "No se encontró el producto", error });
    }
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
      req.logger.error("error al obtener producto por ID")
      next(error)
    }

}

createProduct = async (req, res, next) => {
  await managerAccess.crearRegistro("alta de producto");

  let owner;
  if (currentUser.role === "premium" ){
    owner =  currentUser._id;
  } else { 
    owner = "64865ebf8365e0a51a27c0c1";
  }
  console.log(owner)

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
    category,
    owner
  );

  try {
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
  
       CustomError.createError({
          name: "error al crear producto",
          cause: generateProductErrorInfo(req.body), 
          message: "Error al cargar el producto", 
          errorCode: EError.INVALID_JSON,
        })
      /*  return res.status(400).json({
        error: "Solicitud inválida falta al menos una propiedad requerida",
      });  */
    }
    if (productDTO){
      const nuevoProducto = await productManager.addProduct(productDTO);
     // Emitir evento a todos los clientes conectados cuando se agrega un nuevo producto
      io.emit("update", nuevoProducto);
      res.send({"PRODUCTO AGREGADO": nuevoProducto });
    } 
  } catch (error) {
    req.logger.error("error al crear producto")
    next(error)
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
      req.logger.error(`error al actualizar producto: ${error}`)
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
      req.logger.error(`error al eliminar el producto: ${error}`)
      res.status(500).send({ error: "Error al eliminar el producto" });
    }
}

}