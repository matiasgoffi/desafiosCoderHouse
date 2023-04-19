import fs from "fs";

//en este archivo declaro la clase y sus metodos usando modelo de persistencia fs

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

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
    const productos = await this.consultarProductos(this.path);
    let id = 1;

    if (productos.length !== 0) {
      id = productos[productos.length - 1].id + 1;
    }

    let producto = {
      title: title,
      description: description,
      price: price,
      code: code,
      status: status ? status : true,
      thumbnails: thumbnails,
      stock: stock,
      category: category,
      id: id,
    };

    productos.push(producto);
    await this.writeProductFile(productos);

    return producto;
  }

  //este metodo genera el write
  writeProductFile = async (productos) => {
     try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );
    } catch {
      console.log("error al guardar el producto");
    }
  };

  //arreglo con todos los productos.
  getProducts = async (limit) => {
    const productos = await this.consultarProductos(this.path);
    if (limit) {
      return productos.slice(0, limit); // Devolver los primeros "limit" productos
    } else {
      return productos; // Devolver todos los productos
    }
  };

  //metodo buscar producto por id.
  getProductsById = async (id) => {
    const productos = await this.consultarProductos(this.path);
    let product = productos.find((product) => product.id == id);
    if (product) {
      return product;
    } else {
      console.log("no se encontró el id");
      return null;
    }
  };

  //metodo modificar producto
  updateProduct = async (
    id,
    title,
    description,
    price,
    code,
    status,
    thumbnails,
    stock,
    category
  ) => {
    const productos = await this.consultarProductos(this.path);
    const productoIndex = productos.findIndex((product) => product.id === id);

    if (productoIndex === -1) {
      console.log("no se encontró el id");
      return null;
    }

    const productoActualizado = {
      ...productos[productoIndex],
      title: title || productos[productoIndex].title,
      description: description || productos[productoIndex].description,
      price: price || productos[productoIndex].price,
      code: code || productos[productoIndex].code,
      status: status || productos[productoIndex].status,
      thumbnails: thumbnails || productos[productoIndex].thumbnails,
      stock: stock || productos[productoIndex].stock,
      category: category || productos[productoIndex].category,
    };

    productos[productoIndex] = productoActualizado;
    await this.writeProductFile(productos);

    return productoActualizado;
  };

  //metodo consultar prodcuto
  consultarProductos = async (path, limit) => {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, "utf-8");

      const productos = JSON.parse(data);
      // verificar por id que existe y devolverlo

      if (limit) {
        return productos.slice(0, limit); // Devolver los primeros "limit" productos
      } else {
        return productos; // Devolver todos los productos
      }
    } else {
      return [];
    }
  };
  //metodo eliminar producto
  deleteProduct = async (id) => {
    const productos = await this.consultarProductos(this.path);

    let index = productos.findIndex((product) => product.id === id);
    if (index === -1) {
      console.log("el id no existe");
    }
    let nuevosProductos = productos.filter((product) => product.id !== id);
    await this.writeProductFile(nuevosProductos);
    console.log("producto eliminado");
  };
}
