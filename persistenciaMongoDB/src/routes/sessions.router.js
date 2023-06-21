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


/* router.post("/restartPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });

  const user = await userModel.findOne({ email });
  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });

  const newHashedPassword = createHash(password);

  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: newHashedPassword } }
  );

  res.send({ status: "success", message: "Contraseña actualizada" });
}); */

router.get( "/github", passport.authenticate("github", { scope: ["user:email"] }),
 async (req, res) => {}
);

//GITHUB CALLBACK
router.get("/githubcallback",passport.authenticate("github", { failureRedirect: "/" }),sessioncontroller.githubCallback);

//CURRENT SESSION
router.get("/current",sessioncontroller.getCurrentSession);

export default router;
