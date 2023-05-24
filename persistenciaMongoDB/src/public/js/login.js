const form = document.getElementById("loginForm");
const inputEmail = document.getElementById("inputemail");




form.addEventListener('submit', e =>{
    e.preventDefault();


    function validarEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      }
    inputEmail.addEventListener("blur", () => {
        const email = inputEmail.value.trim();
        if (!validarEmail(email)) {
          inputEmail.focus();
        }
      });

    const data = new FormData(form);

    const obj = {};

    data.forEach((value,key) => obj[key]=value)

    fetch('/api/session/',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>{
        if(result.status == 200){
            window.location.replace('/products')
        }
    })
})


