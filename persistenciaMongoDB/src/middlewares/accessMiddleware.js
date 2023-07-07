import { currentRole } from "../config/passport.config.js";

const accessMiddleware = (role) => (req, res, next) => {
  try {
    console.log(currentRole);
    if (currentRole === role) {
      next();
    } else {
      // Si el rol no coincide, puedes enviar una respuesta de error
      res.status(401).json({ error: "Acceso no autorizado" });
    }
  } catch (error) {
    console.error("Error:", error);
    // Pasar el error al siguiente middleware de manejo de errores
    next(error);
  }
};

export default accessMiddleware;