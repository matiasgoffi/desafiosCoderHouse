import { cartsModel } from "../../models/carts.js";
import CartRepository from "../../../repositories/cartRepository.js";
import { Product } from "../../models/cartsProducts.js";


const cartRepository = new CartRepository();

export default class CartManager {

  async createCart() {
    try {
      const carts = await cartRepository.consultarCarritos();
      let id = 1;
      if (carts.length !== 0) {
        id = carts[carts.length - 1].id + 1;
      }

      let cart = {
        id: id,
        products: [],
      };

      const createdCart = await cartRepository.createCart(cart);
      return createdCart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async getCartById(id) {
    try {
      const cartDTO = await cartRepository.getCartById(id);
      if (cartDTO) {
        // Puedes acceder a las propiedades del DTO si es necesario
        const { id, products } = cartDTO;
        // Realiza cualquier operación adicional necesaria
        // ...
        return cartDTO;
      } else {
        throw new Error("No se encontró el ID del carrito");
      }
    } catch (error) {
      throw new Error("Error al obtener el carrito por ID: " + error.message);
    }
  }


  async updateCart(cart) {
    console.log("el carrito que llega a updateCart en la class manager",cart)
    const updated = await cartRepository.updateCart(cart);
    return updated;
    
  }


  async updateProductQuantity(cid, pid, quantity) {
    try {
      // Obtiene el carrito por su ID
      const cart = await cartRepository.getCartById(cid);
  
      // Busca el producto en el carrito por su ID
      const existingProductIndex = cart.products.findIndex((product) => product._id.toString() === pid.trim());
      // Verifica si se encontró el producto en el carrito
      if (existingProductIndex !== -1) {
        // Actualiza la cantidad del producto
        cart.products[existingProductIndex].quantity = quantity;
  
        // Guarda los cambios en el carrito
        const updated = await cartRepository.updateCart(cart);
  
        if (updated) {
          return true; // Indica que la cantidad del producto fue actualizada exitosamente
        } else {
          throw new Error("No se pudo actualizar el carrito");
        }
      } else {
        throw new Error(`No se encontró el producto con ID ${pid} en el carrito`);
      }
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
  }

  async deleteCart(cartId) {
    try {
      await cartRepository.deleteCart(cartId);
    } catch (error) {
      throw new Error("Error al eliminar el carrito: " + error.message);
    }
  }

}