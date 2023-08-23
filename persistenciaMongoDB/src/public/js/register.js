const form = document.getElementById('registerForm');


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
            console.log('Registro exitoso');
        } else {
            console.log('Error en el registro');
        }
    } catch (error) {
        console.log(error);
    }
});
/* form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    try {
        fetch('/api/session/register',{
            method:'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error) {
        console.log(error)
    }
}) */

