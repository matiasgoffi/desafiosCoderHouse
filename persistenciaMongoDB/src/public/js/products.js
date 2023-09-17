
export let carrito = [];



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
         buttonElement.addEventListener("click", () => { agregarAlCarrito(producto);});
 
 
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

/* LÓGICA DETALLE DE LA COMPRA */

//CREAR MODAL QUE SE EJECUTE EN LA PAGE DE PRODUCTOS CON LA FINALIZACION DE LA COMPRA
const buyTable = document.getElementById("buyTable");
const openModalBtn = document.querySelector(".button-comprar");
const vaciarCarrito = document.querySelector(".button-borrar");
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".close");
// Obtener referencia al elemento div del contador
const contenedorCarrito = document.querySelector(".contenedor-carrito");
const numberCarrito = contenedorCarrito.querySelector(".number-carrito");

// Función para abrir el modal
function openModal() {
  modal.style.display = "block";
}

// Función para cerrar el modal
function closeModal() {
  modal.style.display = "none";
  buyTable.innerHTML = '';
}

// Función para cerrar el modal
function vaciarCarro() {
  carrito = [];
  contador = 0;
  numberCarrito.textContent = contador;
}

//events
openModalBtn.addEventListener("click", function () {
  openModal();
  createBuyTable(carrito);
});

vaciarCarrito.addEventListener("click", function () {
  vaciarCarro();
});
        
closeBtn.addEventListener("click", closeModal);
      
  window.addEventListener("click", (event) => {
     if (event.target === modal) {
           closeModal();
      }
    });

let contador = 0;
// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    // Aumentar el contador en 1
    contador++;

    // Actualizar el valor del contador en el elemento div
    numberCarrito.textContent = contador;

    // Agregar el producto al array del carrito
    carrito.push(producto);
}

              
function createBuyTable(carrito) {
          // Crear la tabla y su encabezado
          const table = document.createElement("table");
          const thead = document.createElement("thead");
          const trHead = document.createElement("tr");
        
          // Crear encabezados
          const thQuantity = document.createElement("th");
          thQuantity.textContent = "Cantidad";
        
          const thProductName = document.createElement("th");
          thProductName.textContent = "Nombre";
        
          const thPrice = document.createElement("th");
          thPrice.textContent = "Precio";
        
          const thDeleteProduct = document.createElement("th");
          thDeleteProduct.textContent = "Eliminar";
          
        
          // Agregar encabezados al encabezado de la tabla
          trHead.appendChild(thQuantity);
          trHead.appendChild(thProductName);
          trHead.appendChild(thPrice);
          trHead.appendChild(thDeleteProduct);
          thead.appendChild(trHead);
        
          // Agregar el encabezado a la tabla
          table.appendChild(thead);
        
          // Recorrer el array de productos en el carrito y crear una fila para cada uno
          const tbody = document.createElement("tbody");
        
          carrito.forEach((producto) => {
            const tr = document.createElement("tr");
        
            // Celdas de la fila
            const tdQuantity = document.createElement("td");
            tdQuantity.textContent = "1"; // Aquí puedes agregar la cantidad si tienes esa información.
            tdQuantity.style.textAlign = "center"; // Centrar horizontalmente
            tdQuantity.style.verticalAlign = "middle"; // Centrar verticalmente
        
            const tdProductName = document.createElement("td");
            tdProductName.textContent = producto.title;
            tdProductName.style.textAlign = "center"; // Centrar horizontalmente
            tdProductName.style.verticalAlign = "middle"; // Centrar verticalmente
        
            const tdPrice = document.createElement("td");
            tdPrice.textContent = `$${producto.price}`;
            tdPrice.style.textAlign = "center"; // Centrar horizontalmente
            tdPrice.style.verticalAlign = "middle"; // Centrar verticalmente
        
            // Celda de "eliminar"
            const tdDeleteProduct = document.createElement("td");
            tdDeleteProduct.style.textAlign = "center"; // Centrar horizontalmente
            tdDeleteProduct.style.verticalAlign = "middle"; // Centrar verticalmente
        
            // Crear el botón "eliminar"
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
        
            // Agregar un manejador de eventos al botón "eliminar"
            deleteButton.addEventListener("click", () => {
                tr.remove();
            });
        
            // Agregar el botón "Eliminar" como hijo de la celda
            tdDeleteProduct.appendChild(deleteButton);
        
            // Agregar celdas a la fila
            tr.appendChild(tdQuantity);
            tr.appendChild(tdProductName);
            tr.appendChild(tdPrice);
            tr.appendChild(tdDeleteProduct);
            // Agregar fila a la tabla
            tbody.appendChild(tr);
          });
          const trConfirmacionCompra = document.createElement("tr");
          const buttonConfirmacionCompra = document.createElement("button");
          buttonConfirmacionCompra.classList.add("button-confirmacionCompra")
          buttonConfirmacionCompra.textContent = "confirmar"
          buttonConfirmacionCompra.addEventListener("click", () => {finalizarcompra(carrito)});
          trConfirmacionCompra.appendChild(buttonConfirmacionCompra)
          tbody.appendChild(trConfirmacionCompra)
          // Agregar el cuerpo de la tabla a la tabla
          table.appendChild(tbody);
        
          // Agregar la tabla al elemento con ID "buyTable"
          buyTable.appendChild(table);
     
  
}























