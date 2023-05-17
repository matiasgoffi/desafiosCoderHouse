fetch("/api/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const listaProductos = document.getElementById("lista-productos");
    const ulProductos = document.createElement("ul");
    // Recorrer el array de productos y crear un <li> para cada uno
    data.payload.forEach((producto) => {
     console.log( producto)
      const liProducto = document.createElement("li");
      liProducto.classList.add("item-lista");
      liProducto.innerText = producto.title;
      ulProductos.appendChild(liProducto);
    });

    // Agregar la lista de productos al contenedor en la página
    listaProductos.appendChild(ulProductos);
  })
  .catch((error) => {
    console.error("Error al cargar el archivo JSON", error);
  });
