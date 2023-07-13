import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import CartManager from "../Dao/Managers/cartManager/cartManager.js";
import CartDTO from "../Dao/DTOs/cartDTO.js";
import { cartsModel } from "../Dao/models/carts.js";
import { productsModel } from "../Dao/models/products.js";
import { v4 as uuidv4 } from 'uuid';
import { Ticket } from "../Dao/models/ticket.js";
import ProductManager from "../Dao/Managers/productManager/ProductManager.js";
import { currentEmail } from "../config/passport.config.js";
import mongoose from "mongoose";
import userModel from "../Dao/models/User.model.js";
import { transport } from "../config/gmail.js";
import  CustomError  from "../services/customError.services.js";
import EError  from "../enums/Error.js";
import { generateProductErrorParamsInfo } from "../services/productErrorParams.js";




const cartManager = new CartManager(); // Creo una instancia de CartManager
const managerAccess = new ManagerAccess(); // Creo una instancia de ManagerAccess
const productManager = new ProductManager();//Creo instancia del ProductManager


export default class CartsController {
  createNewCart = async (req, res) => {
    try {
      const { id, products } = req.body; // Obtén los valores del cuerpo de la solicitud
      const cartDTO = new CartDTO(id, products); // Crea una instancia del DTO

      const nuevoCarrito = await cartManager.createCart(cartDTO); // Llama al método createCart de CartManager pasando el DTO
      res.send({ nuevoCarrito });

      // Registra el movimiento en el archivo de registro
      const method = "POST /carritos";
      managerAccess.crearRegistro(method);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Ocurrió un error al crear el carrito" });
    }
  };

  getCartForId = async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await cartManager.getCartById(cid); // Llama al método getCartById de CartManager
      console.log(cart)
      const products = cart.products;
      res.send(products);
      // Registra el movimiento en el archivo de registro
      const method = "GET /carrito";
      managerAccess.crearRegistro(method);
    } catch (error) {
      console.error(error);
      res.status(404).send({ error: error.message }); // Enviar una respuesta con el mensaje de error adecuado
    }
  };
  addProductToCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      const prodId = req.params.pid;
      const pid = prodId.trim(); // Elimina espacios en blanco al principio y al final
      const isValidId = mongoose.Types.ObjectId.isValid(pid);
      if (!isValidId) {
        throw new Error("ID de producto inválido");
      }   
      const user = await userModel.findOne({email: currentEmail});
      console.log(user.cart._id)
      const cart = await cartManager.getCartById(cid); // Llama al método getCartById de CartManager
      console.log(cart.id)
      const product = await productManager.getProductsById(pid) //corroboro que el producto exista
      if (!cart) {
        return res.send({ error: `El carrito con id ${cid} no existe` });
      }
      if(cid !== user.cart._id.toString()){
        return res.send({ error: `El carrito con id ${cid} no pertenece al usuario con sesión activa` });
      }
      if (!product){
        return res.send({ error: `El producto con id ${pid} no existe` });
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
        const newProduct = { _id: pid, quantity: 1 };
        console.log(newProduct)
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
  };

  deleteProductFromCart = async (req, res, next) => {
    try {
      const cid = req.params.cid; // ID del carrito
      const pid = req.params.pid; // ID del producto a eliminar

      const productid = parseInt(pid);
      if (Number.isNaN(productid)){
       let error =  CustomError.createError({
          name: "id del producto incorrecto",
          cause: generateProductErrorParamsInfo(pid),
          message: "Error al eliminar el producto por id",
          errorCode: EError.INVALID_PARAM,
        })
        res.status(400).send({ error: "No se encontró el producto", error });
      }
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
      next(error)
    }
  }

  updateCartWithProducts = async (req, res) => {
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
  };
  updateProductQuantity = async (req, res, next) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const quantity = req.body.quantity;
    
      const productid = parseInt(pid);
      if (Number.isNaN(productid)){
       let error =  CustomError.createError({
          name: "id del producto incorrecto",
          cause: generateProductErrorParamsInfo(pid),
          message: "Error al actualizar la cantidad del producto por id",
          errorCode: EError.INVALID_PARAM,
        })
      }
      // Actualiza la cantidad del producto en el carrito
      await cartManager.updateProductQuantity(cid, pid, quantity);

      res.send({ message: "Cantidad del producto actualizada correctamente" });
    } catch (error) {
     next(error)
    }
  };

  deleteAllProductsFromCart = async (req, res) => {
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
      res
        .status(500)
        .send({
          error: "Ocurrió un error al eliminar los productos del carrito",
        });
    }
  };
  generateTicket = async (req, res) => {
    try {
      const cartid = req.params.cid;
      const cart = await cartManager.getCartById(cartid);
      const user = await userModel.findOne({email: currentEmail});
      if(cartid !== user.cart._id.toString()){
        return res.send({ error: `El carrito con id ${cid} no pertenece al usuario con sesión activa` });
      }
      if (cart){
        if(!cart.products.length){
          return res.send("es necesario que agregue un producto")
        }
       const ticketProducts =[];
      const rejectedProducts =[];
        let total = 0;
       for (let i = 0; i < cart.products.length; i++) {
          const cartProduct = cart.products[i];
          const productDB = await productsModel.findById(cartProduct.id);
          //cantidad de productos
          if(cartProduct.quantity <= productDB.stock){
            ticketProducts.push(cartProduct);
            total += cartProduct.quantity*productDB.price;
            let stockactualizado = productDB.stock -= cartProduct.quantity;
            await productsModel.updateOne( 
              { _id: productDB.id },
              {
                title: productDB.title || "",
                description: productDB.description || "",
                price: productDB.price || 0,
                code: productDB.code || 0,
                status: productDB.status || true,
                thumbnails: productDB.thumbnails || [],
                stock: stockactualizado || 0,
                category: productDB.category || "",
              },
              { new: true }
            )
          } else {
            rejectedProducts.push(cartProduct)
            continue;
          }
        }
        let newTicket = {
          code: uuidv4(),
          purchase_datetime: new Date(),
          amount: total,
          purchaser: currentEmail,
        }
       const ticketCreated = await Ticket.create(newTicket);
       cartsModel.updateOne({_id:cartid}, cart);
       res.json({ticket: ticketCreated, ProductosSinProcesar: rejectedProducts}) 
      //FINALIZADA LA COMPRA ACTUALIZAR CARRITO CON LOS PRODUCTOS SIN PROCESAR
      console.log(rejectedProducts)
      const newData = { ...cart, products: rejectedProducts };
      console.log(newData);
      await cartManager.updateCart(newData)
      //ENVIAR TICKET AL MAIL
        let contenidoMail = await transport.sendMail({
          from:'ecommerce Universo Calzado',
          to:'goffimatias@gmail.com',
          subject:'ticket de compra',
          html:`
          <div>
            <h1>ticket de compra universo calzado</h1>
            <br>
            <h5>USUARIO: ${newTicket.purchaser}</h5>
            <h5>CODIGO DE COMPRA: ${newTicket.code}</h5>
            <h5>MONTO FINAL: $${newTicket.amount}</h5>
          </div>
          `
         })

      }else {
        res.send("el carrito no existe")
      } 
    } catch (error) {
      console.log(error); // Imprimir el error en la consola
      res.status(500).send("Ocurrió un error al procesar la compra"); // Enviar una respuesta de error al cliente
    }
  }

}
