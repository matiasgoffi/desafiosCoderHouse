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

   export { transport }