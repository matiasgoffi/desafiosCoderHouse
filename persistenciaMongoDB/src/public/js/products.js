 // Variable global para almacenar el contador
let contador = 0;

// Obtener referencia al elemento div del contador
const contenedorCarrito = document.querySelector(".contenedor-carrito");
const numberCarrito = contenedorCarrito.querySelector(".number-carrito");
 
 // Obtener referencia a los elementos del DOM
const listaProductos = document.getElementById("lista-productos");
const prevButton = document.getElementById("prevPageBtn");
prevButton.classList.add("prev-button");
const nextButton = document.getElementById("nextPageBtn");
nextButton.classList.add("next-button");
const actualPage = document.getElementById("actualPage");
actualPage.classList.add("actual-page");

// Función para cargar los productos con una URL específica
function fetchProducts(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      listaProductos.innerHTML = "";
      actualPage.textContent = data.currentPage;

      // Recorrer el array de productos y crear una tarjeta para cada uno
      data.payload.forEach((producto) => {
        const cardProducto = document.createElement("div");
        cardProducto.classList.add("item-lista");

        // Crear elementos HTML para mostrar las propiedades del producto
        const imageElement = document.createElement("img");
        imageElement.src = producto.thumbnails[0]; 
        imageElement.classList.add("item-image");


        const titleElement = document.createElement("h3");
        titleElement.innerText = producto.title;

        const categoryElement = document.createElement("h5");
        categoryElement.innerText = `Category: ${producto.category}`;

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = producto.description;

        const priceElement = document.createElement("p");
        priceElement.innerText = `Price: $${producto.price}`;

        const codeElement = document.createElement("p");
        codeElement.innerText = `Code: ${producto.code}`;

        const buttonElement = document.createElement("button");
        buttonElement.innerText = "agregar al carrito";
        buttonElement.classList.add("item-button");
        //AGREGAR LOGICA PARA DAR UN ID UNICO Y LUEGO USAR ESE ID PARA CARGAR UN PRODUCTO
        buttonElement.addEventListener("click", () => {
          // Aumentar el contador en 1
          contador++;
        
          // Actualizar el valor del contador en el elemento div
          numberCarrito.textContent = contador;
        });


        // Agregar los elementos al contenedor de la tarjeta
        cardProducto.appendChild(imageElement);
        cardProducto.appendChild(titleElement);
        cardProducto.appendChild(categoryElement);
        cardProducto.appendChild(descriptionElement);
        cardProducto.appendChild(priceElement);
        cardProducto.appendChild(codeElement);
        cardProducto.appendChild(buttonElement);
        
        listaProductos.appendChild(cardProducto);
      });

      // Habilitar o deshabilitar botones según corresponda
      prevButton.disabled = !data.hasPrevPage;
      nextButton.disabled = !data.hasNextPage;

      // Actualizar las URL de los botones según corresponda
      prevButton.dataset.page = data.prevPage;
      nextButton.dataset.page = data.nextPage;
    })
    .catch((error) => {
      console.error("Error al cargar el archivo JSON", error);
    });
}

// Event Listener para el botón "Anterior"
prevButton.addEventListener("click", () => {
  const page = prevButton.dataset.page;
  const url = `/api/products/limit?page=${page}`;
  fetchProducts(url);
});

// Event Listener para el botón "Siguiente"
nextButton.addEventListener("click", () => {
  const page = nextButton.dataset.page;
  const url = `/api/products/limit?page=${page}`;
  fetchProducts(url);
});

// Cargar los productos iniciales al cargar la página
fetchProducts("/api/products/limit"); 


























//opcion handlebars no denderiza


/* const source = document.getElementById('product-template').innerHTML;
const template = Handlebars.compile(source);

// Obtener referencia a los elementos del DOM
const listaProductos = document.getElementById("lista-productos");
const prevButton = document.getElementById("prevPageBtn");
prevButton.classList.add("prev-button");
const nextButton = document.getElementById("nextPageBtn");
nextButton.classList.add("next-button");
const actualPage = document.getElementById("actualPage");
actualPage.classList.add("actual-page");

// Función para cargar los productos con una URL específica
function fetchProducts(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      listaProductos.innerHTML = "";
      actualPage.textContent = data.currentPage;

      // Recorrer el array de productos y crear una tarjeta para cada uno
      const renderedProducts = data.payload.map(producto => {
        return template(producto);
      });
      listaProductos.innerHTML = renderedProducts.join('');

      // Habilitar o deshabilitar botones según corresponda
      prevButton.disabled = !data.hasPrevPage;
      nextButton.disabled = !data.hasNextPage;

      // Actualizar las URL de los botones según corresponda
      prevButton.dataset.page = data.prevPage;
      nextButton.dataset.page = data.nextPage;
    })
    .catch((error) => {
      console.error("Error al cargar el archivo JSON", error);
    });
}

// Event Listener para el botón "Anterior"
prevButton.addEventListener("click", () => {
  const page = prevButton.dataset.page;
  const url = `/api/products?page=${page}`;
  fetchProducts(url);
});

// Event Listener para el botón "Siguiente"
nextButton.addEventListener("click", () => {
  const page = nextButton.dataset.page;
  const url = `/api/products?page=${page}`;
  fetchProducts(url);
});

// Cargar los productos iniciales al cargar la página
fetchProducts("/api/products")
 */

