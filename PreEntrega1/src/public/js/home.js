fetch("/api/products")
  .then((response) => response.json())
  .then((data) => {
    // Aquí ya tienes acceso a los datos del archivo JSON
    console.log(data); // o puedes hacer cualquier otra cosa que necesites con los datos
    // Luego, puedes pasar los datos como argumento a la función que desees
    const listaProductos = document.getElementById("lista-productos");
    const ulProductos = document.createElement("ul");
    // Recorrer el array de productos y crear un <li> para cada uno
    data.forEach((producto) => {
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
