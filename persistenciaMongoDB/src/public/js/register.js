const form = document.getElementById('registerForm');
const alertMessage = document.getElementById("alertMessage");


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form); // Utiliza FormData para manejar datos del formulario, incluido el archivo
    console.log(data.get('avatar'));
    try {
        const response = await fetch('/api/session/register', {
            method: 'POST',
            body: data, // Usa directamente el objeto FormData en el cuerpo de la solicitud
        });
        
        if (response.ok) {
            alertMessage.textContent = "Usuario registrado con éxito.";
            alertMessage.style.color = "green";
            alertMessage.style.display = "block";
            setTimeout(() => {
                alertMessage.style.display = "none";
                window.location.href = "/"; 
            }, 3000);
            console.log('Registro exitoso');
            
        } else {
            alertMessage.textContent = "Error en el registro";
            alertMessage.style.color = "red";
            alertMessage.style.display = "block";
            setTimeout(() => {
                alertMessage.style.display = "none";
            }, 3000);
            console.log('Error en el registro');
        }
    } catch (error) {
        console.log(error);
    }
});

