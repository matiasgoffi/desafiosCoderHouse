import { cartsModel } from "../../models/carts.js";

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
    const carts = await this.consultarCarritos();
    let cart = carts.find((carrito) => carrito.id == id);
    if (cart) {
      return cart;
    } else {
      throw new Error("No se encontró el ID del carrito");
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
}
