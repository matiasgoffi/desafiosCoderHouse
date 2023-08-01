import { currentRole } from "../config/passport.config.js";

const accessMiddleware = (...allowedRoles) => (req, res, next) => {
  try {
    req.logger.info(currentRole)
    if (allowedRoles.includes(currentRole)) {
      next();
    } else {
      // Si el rol no coincide, puedes enviar una respuesta de error
      res.status(401).json({ error: "Acceso no autorizado" });
    }
  } catch (error) {
    req.logger.error(`error: ${error}`)
    // Pasar el error al siguiente middleware de manejo de errores
    next(error);
  }
};

export default accessMiddleware;