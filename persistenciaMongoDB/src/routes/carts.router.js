import { Router } from "express";
import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import CartManager from "../Dao/Managers/cartManager/cartManager.js";

const router = Router();
const cartManager = new CartManager(); // Crea una instancia de CartManager
const managerAccess = new ManagerAccess(); // Crea una instancia de ManagerAccess

// Ruta POST carritos with mongoose
router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.createCart(); // Llama al método createCart de CartManager
    res.send({ nuevoCarrito });
    // Registra el movimiento en el archivo de registro
     const method = 'POST /carritos';
     managerAccess.crearRegistro(method);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Ocurrió un error al crear el carrito" });
  }
});

// Ruta GET :cid carrito with mongoose
router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid); // Llama al método getCartById de CartManager

    const products = cart.products;
    res.send(products);
    // Registra el movimiento en el archivo de registro
    const method = 'GET /carrito';
    managerAccess.crearRegistro(method);
  } catch (error) {
    console.error(error);
    res.status(404).send({ error: error.message }); // Enviar una respuesta con el mensaje de error adecuado
  }
});

// Ruta POST :cid/product/:pid add product by cart id with mongoose
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartManager.getCartById(cid); // Llama al método getCartById de CartManager
    console.log(cart)
    if (!cart) {
      return res.send({ error: `El carrito con id ${cid} no existe` });
    }

    const products = cart.products;

    const existingProductIndex = products.findIndex(
      (product) => product.producto === pid
    );

    console.log(existingProductIndex);
    if (existingProductIndex !== -1) {
      // El producto ya existe en el carrito, se incrementa la cantidad
      products[existingProductIndex].quantity += 1;
    } else {
      // El producto no existe en el carrito, se agrega al array de productos
      const newProduct = { producto: pid, quantity: 1 };

      products.push(newProduct);
    }

    const updated = await cartManager.updateCart(cart); // Llama al método updateCart de CartManager
    
    if (updated) {
      res.send(cart);
    } else {
      res.status(500).send({ error: "Error al actualizar el carrito" });
    }
   // Registra el movimiento en el archivo de registro
     const method = 'POST / agrego producto al carrito';
     managerAccess.crearRegistro(method);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Ocurrió un error al procesar la solicitud" });
  }
});
export default router;



