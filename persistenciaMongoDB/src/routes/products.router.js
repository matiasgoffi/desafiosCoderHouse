import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import accessMiddleware from "../middlewares/accessMiddleware.js";

const router = Router();

//const path = "./files/productos.json";
const productscontroller = new ProductsController(); // Crea una instancia de ManagerAccess


// ruta GET products with mongoose
router.get("/limit/:limit?", productscontroller.getProductsFromPage);


// ruta GET products by id with mongoose
router.get("/:pid",productscontroller.getProductById);


// ruta POST products with mongoose
router.post("/",accessMiddleware("admin"), productscontroller.createProduct);


//ruta PUT actualizar producto with mongoose
router.put("/:pid", accessMiddleware("admin"), productscontroller.updateProduct);

// ruta DELETE product with mongoose
router.delete("/:pid", accessMiddleware("admin"), productscontroller.deleteProduct);

export default router;
