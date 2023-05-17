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
    const method = "POST /carritos";
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
    const method = "GET /carrito";
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
    if (!cart) {
      return res.send({ error: `El carrito con id ${cid} no existe` });
    }

    const products = cart.products;

    const existingProductIndex = products.findIndex(
      (product) => product._id.toString() === pid.trim()
    );

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
    const method = "POST / agrego producto al carrito";
    managerAccess.crearRegistro(method);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Ocurrió un error al procesar la solicitud" });
  }
});

// Ruta DELETE :cid/product/:pid add product by cart id with mongoose
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid; // ID del carrito
    const pid = req.params.pid; // ID del producto a eliminar

    // Obtener el carrito por ID
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.send({ error: `El carrito con id ${cid} no existe` });
    }

    // Buscar el índice del producto en el carrito
    const existingProductIndex = cart.products.findIndex(
      (product) => product._id.toString() === pid
    );

    if (existingProductIndex !== -1) {
      // El producto existe en el carrito, se elimina del array de productos
      cart.products.splice(existingProductIndex, 1);
    }

    // Actualizar el carrito en la base de datos
    const updatedCart = await cartManager.updateCart(cart);

    if (updatedCart) {
      res.send(updatedCart);
    } else {
      res.status(500).send({ error: "Error al actualizar el carrito" });
    }

    // Registra el movimiento en el archivo de registro
    const method = "DELETE /carritos";
    managerAccess.crearRegistro(method);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Ocurrió un error al eliminar el carrito" });
  }
});

// Ruta PUT :cid  actualiza el carrito con un arreglo de productos como el especificado antes
router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid; // ID del carrito
    const products = req.body.products; // Arreglo de productos a actualizar en el carrito

    // Obtener el carrito por ID
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.send({ error: `El carrito con id ${cid} no existe` });
    }

    // Actualizar el arreglo de productos del carrito
    cart.products = products;

    // Actualizar el carrito en la base de datos
    const updatedCart = await cartManager.updateCart(cart);

    if (updatedCart) {
      res.send(updatedCart);
    } else {
      res.status(500).send({ error: "Error al actualizar el carrito" });
    }

    // Registra el movimiento en el archivo de registro
    const method = "PUT /carritos";
    managerAccess.crearRegistro(method);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Ocurrió un error al actualizar el carrito" });
  }
});

// Ruta PUT :cid/product/:pid  actualiza solamente la quantity del producto que se pasa por params
router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    // Actualiza la cantidad del producto en el carrito
    await cartManager.updateProductQuantity(cid, pid, quantity);

    res.send({ message: "Cantidad del producto actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Ocurrió un error al actualizar la cantidad del producto" });
  }
});


// Ruta DELETE :cid elimina todos los productos del carrito enviado por cid
router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    // Obtener el carrito por su ID
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.send({ error: `El carrito con id ${cid} no existe` });
    }

    // Eliminar todos los productos del carrito
    cart.products = [];

    // Actualizar el carrito en la base de datos
    await cartManager.updateCart(cart);

    res.send({ message: "Productos eliminados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Ocurrió un error al eliminar los productos del carrito" });
  }
});

export default router;
