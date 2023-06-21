import { cartsModel } from "../../models/carts.js";
import { Product } from "../../models/cartsProducts.js";

export default class CartManager {
  // Elimino el parámetro "path" ya que no se usará con Mongoose

  async createCart() {
    const carts = await this.consultarCarritos();

    let id = 1;
    if (carts.length !== 0) {
      id = carts[carts.length - 1].id + 1;
    }

    let cart = {
      id: id,
      products: [],
    };

    // Creo un documento en la colección de carritos
    const createdCart = await cartsModel.create(cart);

    return createdCart;
  }

  async getCartById(id) {
    try {
      const cart = await cartsModel.findById(id).populate("products.product");
      if (cart) {
        return cart;
      } else {
        throw new Error("No se encontró el ID del carrito");
      }
    } catch (error) {
      throw new Error("Error al obtener el carrito por ID: " + error.message);
    }
  }

  async consultarCarritos(limit) {
    // Consulta todos los carritos en la colección
    let query = cartsModel.find();

    if (limit) {
      query = query.limit(limit); // Limita la cantidad de carritos devueltos
    }

    const carts = await query.exec();

    return carts;
  }

  async updateCart(cart) {
    const updatedCart = await cartsModel.findOneAndUpdate(
      { _id: cart.id },
      { products: cart.products },
      { new: true }
    );
    if (updatedCart) {
      return true; // Indica que el carrito fue actualizado exitosamente
    } else {
      return false; // Indica que el carrito no fue encontrado
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      // Obtiene el carrito por su ID
      const cart = await this.getCartById(cid);
      console.log(cart.products)
      // Busca el producto en el carrito por su ID
      const existingProductIndex = cart.products.findIndex((product) => product._id.toString() === pid.trim());
  
      // Verifica si se encontró el producto en el carrito
      if (existingProductIndex !== -1) {
        // Actualiza la cantidad del producto
        cart.products[existingProductIndex].quantity = quantity;
  
        // Guarda los cambios en el carrito
        await this.updateCart(cart);
  
        return true; // Indica que la cantidad del producto fue actualizada exitosamente
      } else {
        throw new Error(`No se encontró el producto con ID ${pid} en el carrito`);
      }
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
  }
  async deleteCart(cartId) {
    try {
      await cartsModel.findByIdAndDelete(cartId);
    } catch (error) {
      throw new Error("Error al eliminar el carrito: " + error.message);
    }
  }
}
