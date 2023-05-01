import { Router } from "express";
import CartManager from "../cartManager/cartManager.js";

const router = Router();

const path = "./files/carrito.json";
const cartManager = new CartManager(path);

//ruta POST carritos
router.post("/", async (req, res) => {
  const carrito = req.body;

  await cartManager.createCart(carrito);

  res.status(200).json({ message: `carrito creado correctamente` });
});

//ruta GET :cid carrito
router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;

  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    return res.send({ error: `El carrito con id ${cid} no existe` });
  }
  const products = cart.products;

  res.status(200).json(products);
});

//ruta POST :cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    return res.send({ error: `El carrito con id ${cid} no existe` });
  }

  const products = cart.products;

  const existingProduct = products.find((product) => product.producto === pid);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    products.push({ producto: pid, quantity: 1 });
  }

  await cartManager.updateCart(cart);

  res.status(200).json(cart);
});

export default router;
