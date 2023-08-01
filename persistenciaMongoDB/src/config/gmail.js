import nodemailer from "nodemailer";


const transport = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
      user:'goffimatias@gmail.com',
      pass:'mthzmmzwrqmjzehi'
    },
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
   })

   //funcion envio de correo electronico para recuperar contraseña:
   export const sendRecoveryPass = async(userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`;
    await transport.sendMail({
      from:"goffimatias@gmail.com",
      to:userEmail,
      subject: "reestablecer contraseña",
      html:  `
      <div>
      <h2>Has solicitado un cambio de contraseña.</h2>
      <p>Da clic en el siguiente enlace para restableces la contraseña</p>
      <a href="${link}">
      <button> Restablecer contraseña </button>
      </a>        
      </div>
      `
    })
  }

   export { transport }