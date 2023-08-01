import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import accessMiddleware from "../middlewares/accessMiddleware.js";
import compression from "express-compression";

const router = Router();

//const path = "./files/productos.json";
const productscontroller = new ProductsController(); // Crea una instancia de ManagerAccess


// ruta GET products with mongoose
router.get("/limit/:limit?", compression({brotli:{enable:true,zlib:{}}}),productscontroller.getProductsFromPage);


// ruta GET products by id with mongoose
router.get("/:pid", productscontroller.getProductById);


// ruta POST products with mongoose
router.post("/",accessMiddleware("admin", "premium"), productscontroller.createProduct);


//ruta PUT actualizar producto with mongoose
router.put("/:pid", accessMiddleware("admin", "premium"), productscontroller.updateProduct);

// ruta DELETE product with mongoose
router.delete("/:pid", accessMiddleware("admin", "premium"), productscontroller.deleteProduct);


export default router;
