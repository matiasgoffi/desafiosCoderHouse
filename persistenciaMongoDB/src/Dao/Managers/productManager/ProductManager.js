import { productsModel } from "../../models/products.js";
import mongoose from "mongoose";
//en este archivo declaro la clase y sus metodos usando modelo de persistencia fs

export default class ProductManager {
  async addProduct(
    title,
    description,
    price,
    code,
    status,
    thumbnails,
    stock,
    category
  ) {
    const producto = new productsModel({
      title: title,
      description: description,
      price: price,
      code: code,
      status: status ? status : true,
      thumbnails: thumbnails,
      stock: stock,
      category: category,
    });

    try {
      const nuevoProducto = await producto.save();
      return nuevoProducto;
    } catch (error) {
      console.log("cannot add product with mongoose: " + error);
      throw error;
    }
  }

  async getProducts(category, status, sort, limit = 10, page = 1) {
    const options = {
      limit: limit,
      page: page,
      sort: sort === "desc" ? { price: -1 } : { price: 1 }, // Ordena por precio de manera ascendente o descendente
    };
    console.log("sort:", sort);
    // Crea el filtro de agregación
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (status === "true" || status === "false") {
      filter.status = status === "true"; // Filtra los productos según el estado
    }

    const result = await productsModel.paginate(filter, options);
    /*   return productos; */
    return {
      docs: result.docs,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
    };
  }

  //metodo buscar producto por id.
  async getProductsById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID de producto inválido");
    }
  
    const product = await productsModel.findOne({ _id: id });
  
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
    const productoActualizado = await productsModel.findOneAndUpdate(
      { _id: id },
      {
        title: title || "",
        description: description || "",
        price: price || 0,
        code: code || 0,
        status: status || true,
        thumbnails: thumbnails || [],
        stock: stock || 0,
        category: category || "",
      },
      { new: true }
    );

    if (!productoActualizado) {
      console.log("El producto no existe");
      return "El producto no existe";
    }

    return productoActualizado;
  }

  //metodo consultar prodcuto
  async consultarProductos(limit) {
    let query = productsModel.find();

    if (limit) {
      query = query.limit(limit);
    }

    const productos = await query.exec();
    return productos;
  }

  //metodo eliminar producto
  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null; // Indica que el ID no es válido
    }
    const product = await productsModel.findOne({ _id: id });

    if (!product) {
      console.log("El producto no existe");
      return "El producto no existe";
    }
    const deletedProduct = await productsModel.findOneAndDelete({ _id: id });

    console.log("Producto eliminado");
    return deletedProduct;
  }
}
