import { Router } from "express";
import userModel from "../Dao/models/User.model.js";
import CartManager from "../Dao/Managers/cartManager/cartManager.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const router = Router();
const cartManager = new CartManager(); // Crea una instancia de CartManager

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/session/failregister" }),
    async (req, res) => {
      if (req.user === false) {
        // La autenticación falló, el usuario ya existe
        return res.status(400).json({ status: "error", error: "User already exists" });
      }else {
        console.log("User registered"); // Imprimir el mensaje por consola
        res.status(200).json({ status: "success", message: "User registered" });
    }
    }
);

router.get("/failregister", async (req, res) => {
  console.log("Fallo en el registro");
  res.status(400).json({ status: "error", error: "error en el registro" });
});

router.post(
  "/",
  passport.authenticate("login", { failureRedirect: "/api/session/faillogin" }),
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

        

    //genero un carrito durante el logueo para asignarlo a la sesion/usuario
    const cart = await cartManager.createCart(); // Crea un nuevo carrito
    user.cart = cart._id; // Asigna el ID del carrito al campo 'cart' del usuario
    await user.save(); // Guarda los cambios en el usuario

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };
    console.log("Successful login"); // Imprimir el mensaje por consola
    res.status(200).send({
      status: "success",
      payload: req.session.user,
      message: "Successful login",
    });
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("Fallo en el ingreso");
  res.status(400).json({ status: "error", error: "error en el ingreso" });
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

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

router.get("/current", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user)
    // Si hay un usuario en la sesión, devolverlo como respuesta
    res.status(200).json({ status: "success", payload: req.session.user });
  } else {
    // Si no hay un usuario en la sesión, devolver un error
    res.status(400).json({ status: "error", error: "No hay usuario actual" });
  }
});
export default router;
