import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";

const router = Router();
const cartscontroller = new CartsController(); 

// Ruta POST carritos with mongoose
router.post("/", cartscontroller.createNewCart)

// Ruta GET :cid carrito with mongoose
router.get("/:cid", cartscontroller.getCartForId) 


// Ruta POST :cid/product/:pid add product by cart id with mongoose
router.post("/:cid/product/:pid",cartscontroller.addProductToCart);


// Ruta DELETE :cid/product/:pid add product by cart id with mongoose
router.delete("/:cid/product/:pid", cartscontroller.deleteProductFromCart);


// Ruta PUT :cid  actualiza el carrito con un arreglo de productos como el especificado antes
router.put("/:cid",cartscontroller.updateCartWithProducts);

// Ruta PUT :cid/product/:pid  actualiza solamente la quantity del producto que se pasa por params
router.put("/:cid/product/:pid", cartscontroller.updateProductQuantity);


// Ruta DELETE :cid elimina todos los productos del carrito enviado por cid
router.delete("/:cid",cartscontroller.deleteAllProductsFromCart);


export default router;
