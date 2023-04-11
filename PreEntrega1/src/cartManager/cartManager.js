import fs from "fs";

//en este archivo declaro la clase y sus metodos usando modelo de persistencia fs

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  //metodo para crear carrito
  async createCart() {
    const carts = await this.consultarCarritos(this.path);
    let id = 1;

    if (carts.length !== 0) {
      id = carts[carts.length - 1].id + 1;
    }

    let cart = {
      id: id,
      products: [],
    };

    carts.push(cart);
    await this.writeCartFile(carts);

    return cart;
  }

  //este metodo genera el write
  writeCartFile = async (carts) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch {
      console.log("error al guardar el carrito");
    }
  };

  //metodo buscar carrito por id.
  getCartById = async (id) => {
    const carts = await this.consultarCarritos(this.path);
    let cart = carts.find((carrito) => carrito.id == id);
    if (cart) {
      return cart;
    } else {
      console.log("no se encontró el id");
      return null;
    }
  };

  //metodo consultar carritos
  consultarCarritos = async (path, limit) => {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, "utf-8");

      const carts = JSON.parse(data);
      // verificar por id que existe y devolverlo

      if (limit) {
        return carts.slice(0, limit); // Devolver los primeros "limit" carts
      } else {
        return carts; // Devolver todos los carritos
      }
    } else {
      return [];
    }
  };

  //metodo updateCart con el producto agregado o modificado

  async updateCart(cart) {
    const carts = await this.consultarCarritos(this.path);
    
    // Buscar el índice del carrito a actualizar
    const index = carts.findIndex(c => c.id === cart.id);
  
    if (index !== -1) {
      // Actualizar el carrito en la posición encontrada
      carts[index] = cart;
  
      // Guardar los cambios en el archivo
      await this.writeCartFile(carts);
  
      return true; // Indicar que el carrito fue actualizado exitosamente
    } else {
      return false; // Indicar que el carrito no fue encontrado
    }
  }
}
