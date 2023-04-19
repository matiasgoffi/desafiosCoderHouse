const socket = io();
let Productos = [];

socket.on("update", (productos) => {
  console.log(productos);
  Productos.push(productos);
  const listaProductos = document.getElementById("lista-productos-socket");
  listaProductos.innerHTML = "";

  Productos.forEach((producto) => {
    const productoHTML = `
      <div>
        <p>${producto.title}</p>
        <p>${producto.description}</p>
        <p>${producto.price}</p>
        <p>${producto.code}</p>
        <p>${producto.status}</p>
        <p>${producto.stock}</p>
        <p>${producto.category}</p>
      </div>
    `;
    listaProductos.innerHTML += productoHTML;
  });

  socket.on("delete", (pid) => {
    const index = Productos.findIndex((producto) => producto.id === pid);
    if (index > -1) {
      Productos.splice(index, 1);
      const listaProductos = document.getElementById("lista-productos-socket");
      listaProductos.innerHTML = "";
      Productos.forEach((producto) => {
        const productoHTML = `
          <div>
            <p>${producto.title}</p>
            <p>${producto.description}</p>
            <p>${producto.price}</p>
            <p>${producto.code}</p>
            <p>${producto.status}</p>
            <p>${producto.stock}</p>
            <p>${producto.category}</p>
          </div>
        `;
        listaProductos.innerHTML += productoHTML;
      });
    }
  });
});
