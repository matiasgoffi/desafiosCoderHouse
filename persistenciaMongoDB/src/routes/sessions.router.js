import { Router } from "express";
import passport from "passport";
import SessionController from "../controllers/sessions.controller.js";
import { uploaderProfile } from "../utils.js";




const router = Router();
const sessioncontroller = new SessionController(); // Crea una instancia de ManagerAccess



//REGISTER
router.post(
  "/register",
  uploaderProfile.single("avatar"),
  (req, res, next) => {
    console.log("File received:", req.file);
    console.log("Request body:", req.body); // Esto mostrará los datos del cuerpo de la solicitud
    next();
  },
  passport.authenticate("register", { failureRedirect: "/api/session/failregister" }),
  (req, res) => {
    console.log(req.file)
    console.log("Request processing completed."); // Esto indica que la función de manejo de solicitudes se ejecutó
    sessioncontroller.register(req, res);
  }
  
);

//FAIL REGISTER
router.get("/failregister", sessioncontroller.failRegister);


//LOGIN
router.post("/", passport.authenticate("login", { failureRedirect: "/api/session/failLogin", failureFlash: true }),sessioncontroller.login)

//FAIL LOGIN
router.get("/failLogin", sessioncontroller.failLogin)

//LOGOUT
router.get("/logout", sessioncontroller.logout);


router.get( "/github", passport.authenticate("github", { scope: ["user:email"] }),
 async (req, res) => {}
);

//GITHUB CALLBACK
router.get("/githubcallback",passport.authenticate("github", { failureRedirect: "/" }),sessioncontroller.githubCallback);

//CURRENT SESSION
router.get("/current", sessioncontroller.getCurrentSession);

//FORGOT Y 
router.post("/forgot-password", sessioncontroller.forgotPassword);

//reset passwor
router.post("/reset-password", sessioncontroller.resetPassword);


export default router;
