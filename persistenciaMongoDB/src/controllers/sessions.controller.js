import userModel from "../Dao/models/User.model.js";
import CartManager from "../Dao/Managers/cartManager/cartManager.js";
import UserManager from "../Dao/Managers/userManager/userManager.js";
import { createHash, validatePassword, verifyEmailToken, generateEmailToken } from "../utils.js";
import { cartsModel } from "../Dao/models/carts.js";
import userService from "../Dao/models/User.model.js";
import { sendRecoveryPass } from "../config/gmail.js";



const cartManager = new CartManager(); // Crea una instancia de CartManager
const usermanager = new UserManager();
export let currentUser;



export default class SessionController {
    register=async(req, res, next)=>{
        if (req.user === false) {
            // La autenticación falló, el usuario ya existe
            return res.status(400).json({ status: "error", error: "User already exists" });
          }else {  
            req.logger.info("usuario registrado")
            res.status(200).json({ status: "success", message: "User registered" });
              // Mostrar SweetAlert después de un retraso
        }
    }
    failRegister=async(req,res)=>{
        console.log("Fallo en el registro");
        res.status(400).json({ status: "error", error: "error en el registro" });
    }
    login=async(req,res)=>{
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        currentUser = user;
        console.log("user",user)
        if (!user) {
          return res
            .status(400)
            .send({ status: "error", error: "Datos incorrectos" });
        }
        const isValidPassword = validatePassword(password, user);
        console.log("es una contraseña valida", isValidPassword)
        if (!isValidPassword) {
          return res
            .status(400)
            .send({ status: "error", error: "Datos incorrectos" });
        } 
        //genero un carrito durante el logueo para asignarlo a la sesion/usuario
        const cart = await cartManager.createCart(); // Crea un nuevo carrito
        user.cart = cart.id; // Asigna el ID del carrito al campo 'cart' del usuario
        await user.save(); // Guarda los cambios en el usuario
        
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
          role: user.role,
          cart: user.cart,
        };
        console.log("Successful login"); // Imprimir el mensaje por consola
        res.status(200).send({
          status: "success",
          payload: req.session.user,
          message: "Successful login",
        });
    }
   failLogin=async(req,res)=>{
      req.logger.error("falló en el ingreso")
      res.redirect("/failLogin"); 
    }

    logout=async(req, res)=>{
        // Obtén el ID del carrito asociado al usuario
        const cartId = req.session.user.cart;
        cartManager.deleteCart(cartId)
        const user = await userService.findOne({ email: req.session.user.email });
        if(user){
        user.last_connection = new Date(); 
        await user.save(); 
        }
        req.session.destroy((err) => {
            if (err)
              return res
                .status(500)
                .send({ status: "error", error: "No pudo cerrar sesion" });
            res.redirect("/");
          });
      
    }

    githubCallback=async(req,res)=>{
        req.session.user = req.user;
        console.log(req.session.user)
        res.redirect("/products");
    }

     getCurrentSession = async (req, res) => {
    
      if (req.session.user) {
        try {
          // Obtén el usuario actual 
          
          const user = req.session.user;
         // Llama al método getUserDTOFromSession de UserManager para obtener el userDTO
         const userDTO = await usermanager.getUserDTOFromSession(user);
       
          // Devuelve el DTO de usuario como respuesta
          res.status(200).json({ status: "success", payload: userDTO });
        } catch (error) {
          req.logger.error("error al obtener la sesion actual")
          res.status(500).json({ status: "error", error: "Error al obtener la sesión actual" });
        }
      } else {
        req.logger.warning("no hay usuario actual")
        res.status(400).json({ status: "error", error: "No hay usuario actual" });
      }
    };

   forgotPassword=async (req,res)=>{
      try {
          const { email } = req.body;
          console.log(email)
          //verifico si existe
          const user = await userModel.findOne({email:email})
          if(!user){
              return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
          }
          const token = generateEmailToken(email,3*60);
          await sendRecoveryPass(email,token);
          res.send("Se envio un correo a su cuenta para restablecer la contraseña, volver  <a href='/login'>al login</a>")
      } catch (error) {
          return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
    
      }
    };
  
  resetPassword=async (req,res)=>{
    try {
           const token = req.query.token;
           const {email,newPassword}=req.body;
           //validamos el token
           const validEmail = verifyEmailToken(token) 
           if(!validEmail){
            return res.send(`El enlace ya no es valido, genere uno nuevo: <a href="/forgot-password">Nuevo enlace</a>.`)
           }
           const user = await userModel.findOne({email:email});
           if(!user){
            return res.send("El usuario no esta registrado.")
           }
           if(validatePassword(newPassword,user)){
            return res.send("No puedes usar la misma contraseña.")
           }
           const userData = {
            ...user._doc,
            password:createHash(newPassword)
           };
           const userUpdate = await userModel.findOneAndUpdate({email:email},userData);
           res.render("login",{message:"contraseña actualizada"})
  
    } catch (error) {
        res.send(error.message)
    }
  };
 
   
}

