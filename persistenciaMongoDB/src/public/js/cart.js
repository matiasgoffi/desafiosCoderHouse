const listaProductos = document.getElementById("lista-productos");
console.log(listaProductos);

function fetchProducts(url) {
  // Realizar una solicitud GET a la URL para obtener los productos del carrito
  fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
      // Limpiar el contenido existente de la lista de productos
      listaProductos.innerHTML = "";

      // Generar el HTML para cada producto y agregarlo a la lista
      data.forEach(product => {
        const productoHTML = `
          <div class="producto">
            <h3>id: ${product._id}</h3>
            <p>Cantidad: ${product.quantity}</p>
          </div>
        `;
        listaProductos.innerHTML += productoHTML;
      });
    })
    .catch(error => console.error(error));
}

// Obtener el ID del carrito de la URL actual
const cid = window.location.pathname.split("/").pop();

// Cargar los productos del carrito específico al cargar la página
fetchProducts(`/api/carts/${cid}`);