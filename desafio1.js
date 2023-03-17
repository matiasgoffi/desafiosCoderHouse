// Clase ProductManager que gestione productos.

class productManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, code, thumbnail, stock) {
    let id_product = this.products.length;
    let findProduct = this.products.find(
      (product) => product.code == code
    );

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
}

const ProductoManager = new productManager();

let productos = ProductoManager.addProduct(
  "zapatillas Nike Air",
  "zapatillas nike air negras con camara de aire",
  22000,
  0001,
  "https://woker.vtexassets.com/arquivos/ids/246907-1200-1200?v=637729169461870000&width=1200&height=1200&aspect=true",
  100
);

console.log(productos);

const ProductoManager2 = new productManager();

let productos2 = ProductoManager.addProduct(
    "zapatillas adidas",
    "zapatillas adidas rojas con base de caucho",
    30000,
    0001,
    "https://woker.vtexassets.com/arquivos/ids/285204-1200-1200?v=637922006061270000&width=1200&height=1200&aspect=true",
    100
  );
  
  console.log(productos2);
