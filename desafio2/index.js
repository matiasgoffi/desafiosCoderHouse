//este es el file donde voy a ejecutar las lineas del testing - crear una instancia de la clase y llamar a sus metodos
import ProductManager from "./manager/ProductManager.js";

const path = "./files/Products.json"; //este es el file donde voy aguardar los productos
const ProductoManager = new ProductManager(path);

const env = async () => {
//get products
 /*  let productos = await ProductoManager.getProducts();
  console.log(productos); */

//add product
/*  await ProductoManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
  ); */

//segundo producto para corrobar que se modifica sin cambiar el id
/*   await ProductoManager.addProduct(
    "producto prueba2",
    "Este es un producto prueba2",
    500,
    "Sin imagen",
    "abc123",
    60
  ); */


//id product
/* let productoId1 = await ProductoManager.getProductsById(1);
console.log(productoId1);
let productoId10 = await ProductoManager.getProductsById(10);
console.log(productoId10); */

//update product
/* await ProductoManager.updateProduct(4, "nuevo titulo4", null, 100, null, null, null ) */

//delete product 
/* await ProductoManager.deleteProduct(2) */
};
env();
