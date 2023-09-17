import { cartsModel } from "../Dao/models/carts.js";
import CartDTO from "../Dao/DTOs/cartDTO.js";

export default class CartRepository {
  async consultarCarritos(limit) {
    let query = cartsModel.find();

    if (limit) {
      query = query.limit(limit);
    }

    const carts = await query.exec();

    return carts;
  }

  async createCart(cart) {
    try {
      const createdCart = await cartsModel.create(cart);
      const cartDTO = new CartDTO(createdCart._id, createdCart.products);
      return cartDTO;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartsModel.findById(id).populate("products.product");
      if (cart) {
        const cartDTO = new CartDTO(cart._id, cart.products);
        return cartDTO;
      } else {
        throw new Error("No se encontró el ID del carrito");
      }
    } catch (error) {
      throw new Error("Error al obtener el carrito por ID: " + error.message);
    }
  }

  async updateCart(cart) {
    console.log("productos del carrito en el repository",cart.products)
    const updatedCart = await cartsModel.findOneAndUpdate(
      { _id: cart.id },
      { products: cart.products },
      { new: true }
    );
    console.log("updatedCart en la class del repository",updatedCart)
    if (updatedCart) {
      return true;
    } else {
      return false;
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
