import { Router } from "express";
import userModel from "../Dao/models/User.model.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    const { first_name, last_name, email, rol, age, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .send({ status: "error", error: "User already exists" });
    }
    const user = {
      first_name,
      last_name,
      email,
      rol,
      age,
      password: createHash(password),
    };

    const result = await userModel.create(user);
    res.send({ status: "succes", message: "User registered" });
  }
);

router.get("/failregister", async (req, res) => {
  console.log("Fallo en el registro");
  res.send({ error: "Error en el registro" });
});

router.post(
  "/",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
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

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      rol: user.rol,
    };
    res.send({
      status: "success",
      payload: req.res.user,
      message: "Primer logueo!!",
    });
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("Fallo en el ingreso");
  res.send({ error: "Error en el ingreso" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .send({ status: "error", error: "No pudo cerrar sesion" });
    res.redirect("/");
  });
});

router.post("/restartPassword", async (req, res) => {
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
});

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/'}), async (req,res)=>{

    req.session.user = req.user;
    res.redirect('/')

})
export default router;
