// Clase ProductManager que gestione productos.

class productManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, code, thumbnail, stock) {
    let id_product = this.products.length;

    if (!title || !description || !price || !code || !thumbnail || !stock) {
      console.log(
        "Se requieren todas las propiedades para agregar un producto"
      );
      return null;
    }

    let findProduct = this.products.find((product) => product.code == code);

    if (findProduct) {
      return null;
    } else {
      let producto = {
        title: title,
        description: description,
        price: price,
        code: code,
        thumbnail: thumbnail,
        stock: stock,
        id: ++id_product,
      };
      this.products.push(producto);
      return this.products;
    }
  }
  //arreglo con todos los productos creados hasta el momento.
  getProducts() {
    return this.products;
  }

  //debe buscar en el array el producto que coincida con el id, en caso que ninguno coincida devolver error por consola "Not Found".
  getProductsById(id) {
    let product = this.products.filter((product) => product.id == id);

    return product;
  }
}

const ProductoManager = new productManager();

//agrego producto al array con el metodo addProduct
let productos = ProductoManager.addProduct(
  "zapatillas Nike Air",
  "zapatillas nike air negras con camara de aire",
  22000,
  0001,
  "https://woker.vtexassets.com/arquivos/ids/246907-1200-1200?v=637729169461870000&width=1200&height=1200&aspect=true",
  100
);

let productos1 = ProductoManager.addProduct(
  "borcegos salomon",
  "botas trekking",
  55000,
  0002,
  "https://woker.vtexassets.com/arquivos/ids/246907-1200-1200?v=637729169461870000&width=1200&height=1200&aspect=true",
  200
);

//creo producto con el mismo code para ver que la validacion funciona.
let productos2 = ProductoManager.addProduct(
  "zapatillas adidas",
  "zapatillas adidas rojas con base de caucho",
  30000,
  0003,
  "https://woker.vtexassets.com/arquivos/ids/285204-1200-1200?v=637922006061270000&width=1200&height=1200&aspect=true",
  100
);

//aplico el metodo para obtener el producto con el mismo id que le paso.
let productoById = ProductoManager.getProductsById(3);
console.log(productoById);

//traigo todos los productos del array products
let todosLosProductos = ProductoManager.getProducts();
console.log(todosLosProductos);
