import { Router } from "express";
import passport from "passport";
import SessionController from "../controllers/sessions.controller.js";

const router = Router();
const sessioncontroller = new SessionController(); // Crea una instancia de ManagerAccess


//REGISTER
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/session/failregister" }), sessioncontroller.register, 

);

//FAIL REGISTER
router.get("/failregister", sessioncontroller.failRegister);


//LOGIN
router.post("/", passport.authenticate("login", { failureRedirect: "/api/session/faillogin" }),sessioncontroller.login)

//FAIL LOGIN
router.get("/faillogin", sessioncontroller.failLogin)

//LOGOUT
router.get("/logout", sessioncontroller.logout);


router.get( "/github", passport.authenticate("github", { scope: ["user:email"] }),
 async (req, res) => {}
);

//GITHUB CALLBACK
router.get("/githubcallback",passport.authenticate("github", { failureRedirect: "/" }),sessioncontroller.githubCallback);

//CURRENT SESSION
router.get("/current", sessioncontroller.getCurrentSession);


export default router;
