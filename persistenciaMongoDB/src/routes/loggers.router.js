import { Router } from "express";


const router = Router();

// Ruta GET loggers
router.get("/loggerTest", (req, res) => {
    req.logger.fatal("fatal");
    req.logger.error("error");
    req.logger.warning("warning");
    req.logger.info("info");
    req.logger.http("http");
    req.logger.debug("debug");

    res.send("Prueba de logger")
})

export default router;