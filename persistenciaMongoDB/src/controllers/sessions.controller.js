import userModel from "../Dao/models/User.model.js";
import CartManager from "../Dao/Managers/cartManager/cartManager.js";
import UserManager from "../Dao/Managers/userManager/userManager.js";
import { createHash, validatePassword } from "../utils.js";
import { cartsModel } from "../Dao/models/carts.js";

const cartManager = new CartManager(); // Crea una instancia de CartManager
const usermanager = new UserManager();

export default class SessionController {
    register=async(req, res)=>{
        if (req.user === false) {
            // La autenticación falló, el usuario ya existe
            return res.status(400).json({ status: "error", error: "User already exists" });
          }else {
            req.logger.info("usuario registrado")
            res.status(200).json({ status: "success", message: "User registered" });
        }
    }
    failRegister=async(req,res)=>{
        console.log("Fallo en el registro");
        res.status(400).json({ status: "error", error: "error en el registro" });
    }
    login=async(req,res)=>{
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .send({ status: "error", error: "Datos incorrectos" });
        }
        const isValidPassword = validatePassword(password, user);
    
        if (!isValidPassword)
          return res
            .status(400)
            .send({ status: "error", error: "Datos incorrectos" }); 
    
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
        res.status(400).json({ status: "error", error: "error en el ingreso" });
    }

    logout=async(req, res)=>{
        // Obtén el ID del carrito asociado al usuario
        const cartId = req.session.user.cart;
        cartManager.deleteCart(cartId)
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
   
}

