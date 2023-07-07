import ProductRepository from "../../../repositories/productsRepository.js";
import mongoose from "mongoose";
//en este archivo declaro la clase y sus metodos usando modelo de persistencia fs
const productRepository = new ProductRepository();
export default class ProductManager {
  async addProduct(productDTO) {
    try {
      const nuevoProducto = await productRepository.addProduct(productDTO);
      return nuevoProducto;
    } catch (error) {
      console.log("cannot add product with repository: " + error);
      throw error;
    }
  }

  async getProducts(category, status, sort, limit = 10, page = 1) {
    return await productRepository.getProducts(category, status, sort, limit, page);
  }


  //metodo buscar producto por id.
  async getProductsById(id) {
 /*    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID de producto inválido");
    } */

    const product = await productRepository.getProductById(id);

    if (product) {
      return product;
    } else {
      throw new Error("No se encontró el producto con el ID proporcionado");
    }
  }

  //metodo modificar producto
  async updateProduct(
    id,
    title,
    description,
    price,
    code,
    status,
    thumbnails,
    stock,
    category
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null; // Indica que el ID no es válido
    }

    const productoActualizado = await productRepository.updateProduct(
      id,
      title,
      description,
      price,
      code,
      status,
      thumbnails,
      stock,
      category
    );

    if (!productoActualizado) {
      console.log("El producto no existe");
      return "El producto no existe";
    }

    return productoActualizado;
  }

  async consultarProductos(limit) {
    return productRepository.consultarProductos(limit);
  }

  async deleteProduct(id) {
    return productRepository.deleteProduct(id);
  }

}
