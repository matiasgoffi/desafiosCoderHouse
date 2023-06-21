import { Router } from "express";
import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import ProductManager from "../Dao/Managers/productManager/ProductManager.js";
import ProductsController from "../controllers/products.controller.js";

const router = Router();

//const path = "./files/productos.json";
const productManager = new ProductManager();
const managerAccess = new ManagerAccess();
const productscontroller = new ProductsController(); // Crea una instancia de ManagerAccess


// ruta GET products with mongoose
router.get("/limit/:limit?", productscontroller.getProductsFromPage);


// ruta GET products by id with mongoose
router.get("/:pid",productscontroller.getProductById);


// ruta POST products with mongoose
router.post("/",productscontroller.createProduct);


//ruta PUT actualizar producto with mongoose
router.put("/:pid",productscontroller.updateProduct);

// ruta DELETE product with mongoose
router.delete("/:pid", productscontroller.deleteProduct);

export default router;
