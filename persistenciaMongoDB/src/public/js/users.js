 // Obtener referencia a los elementos del DOM
const usersTable = document.getElementById("usersTable");
const url = `/api/users`;

 // Función para cargar los productos con una URL específica
function fetchUsers(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
         // Crear la tabla y su encabezado
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const trHead = document.createElement("tr");
      const thUser = document.createElement("th");
      thUser.textContent = "Usuario";
      const thEmail = document.createElement("th");
      thEmail.textContent = "Email";
      const thRole = document.createElement("th");
      thRole.textContent = "Rol";
      const thModifyRole = document.createElement("th");
      thModifyRole.textContent = "Modificar Rol";
      const thDeleteUser = document.createElement("th");
      thDeleteUser.textContent = "Eliminar Usuario";

      // Agregar encabezado a la tabla
      trHead.appendChild(thUser);
      trHead.appendChild(thEmail);
      trHead.appendChild(thRole);
      trHead.appendChild(thModifyRole);
      trHead.appendChild(thDeleteUser);
      thead.appendChild(trHead);
      table.appendChild(thead);

      // Recorrer el array de usuarios y crear una fila para cada uno
      const tbody = document.createElement("tbody");
      data.message.forEach((user) => {
        const tr = document.createElement("tr");

        // Celdas de la fila
        const tdUserName = document.createElement("td");
        tdUserName.textContent = user.name;

        const tdUserEmail = document.createElement("td");
        tdUserEmail.textContent = user.email;

        const tdUserRole = document.createElement("td");
        tdUserRole.textContent = user.role;

        // Celda de "Modificar"
const tdModifyRole = document.createElement("td");

    // Crear el botón "Modificar"
    const modifyButton = document.createElement("button");
    modifyButton.textContent = "Modificar";

    // Agregar un manejador de eventos al botón "Modificar"
        modifyButton.addEventListener("click", () => {
        // Realizar una solicitud PUT a la ruta deseada
        fetch(`/api/users/premium/${user.id}`, {
            method: "PUT", // Especificar el método PUT
            headers: {
            "Content-Type": "application/json",
            },
        })
            .then((response) => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error("Error al realizar la solicitud PUT");
            }
            })
            .catch((error) => {
            console.error("Error al realizar la solicitud PUT:", error);
            });
        });
        // Agregar el botón "Modificar" como hijo de la celda
        tdModifyRole.appendChild(modifyButton);

        // Celda de "Eliminar"
        const tdDeleteUser = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        // Agregar un manejador de eventos al botón "Eliminar"
        deleteButton.addEventListener("click", () => {
            if (user.email !== "adminCoder@coder.com"){
            // Realizar una solicitud PUT a la ruta deseada
            fetch(`/api/users/${user.id}`, {
                method: "DELETE", // Especificar el método PUT
                headers: {
                "Content-Type": "application/json",
                },
            })
                .then((response) => {
                if (response.ok) {
                    console.log("user dentro del delete",user)
                    window.location.reload();
                } else {
                    console.error("Error al realizar la solicitud DELETE");
                }
                })
                .catch((error) => {
                console.error("Error al realizar la solicitud DELETE:", error);
                });
            }else{
                console.log("no se puede eliminar al administrador")
            }
            });
        tdDeleteUser.appendChild(deleteButton); 

        // Agregar celdas a la fila
        tr.appendChild(tdUserName);
        tr.appendChild(tdUserEmail);
        tr.appendChild(tdUserRole);
        tr.appendChild(tdModifyRole);
        tr.appendChild(tdDeleteUser);

        // Agregar fila a la tabla
        tbody.appendChild(tr);
      });

      // Agregar el cuerpo de la tabla a la tabla
      table.appendChild(tbody);

      // Agregar la tabla al elemento con ID "usersTable"
      usersTable.appendChild(table);
    })
    .catch((error) => {
      console.error("Error al cargar los usuarios", error);
    });
}

fetchUsers(url);
