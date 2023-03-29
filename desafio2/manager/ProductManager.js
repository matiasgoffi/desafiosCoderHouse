import fs from "fs";

//en este archivo declaro la clase y sus metodos usando modelo de persistencia fs

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(title, description, price, code, thumbnail, stock) {
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
      thumbnail: thumbnail,
      stock: stock,
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
  getProducts = async () => {
    const productos = await this.consultarProductos(this.path);
    return productos;
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
    thumbnail,
    stock
  ) => {
    const productos = await this.consultarProductos(this.path);
    const producto = await this.getProductsById(id);

    if(producto){

    if (title) {
      producto.title = title;
    }
    if (description) {
      producto.description = description;
    }
    if (price) {
      producto.price = price;
    }
    if (code) {
      producto.code = code;
    }
    if (thumbnail) {
      producto.thumbnail = thumbnail;
    }
    if (stock) {
      producto.stock = stock;
    }

    let index = productos.findIndex((product) => product.id === id);
    let nuevoProducto = productos[index] = producto;
    await this.writeProductFile(productos);
    return nuevoProducto;
      
    }
  };

  //metodo consultar prodcuto
  consultarProductos = async (path) => {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, "utf-8");

      const productos = JSON.parse(data);
      // verificar por id que existe y devolverlo

      return productos;
    } else {
      return [];
    }
  };
  //metodo eliminar producto
  deleteProduct = async (
    id,
  ) => {
    const productos = await this.consultarProductos(this.path);

    let index = productos.findIndex((product) => product.id === id);
    if(index === -1){
      console.log("el id no existe");
    }
   let nuevosProductos = productos.filter(product =>  product.id !== id);
   await this.writeProductFile(nuevosProductos);

  };
}

