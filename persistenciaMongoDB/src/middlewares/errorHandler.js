import  EError  from "../enums/Error.js";

export const errorHandler = (error, req, res, next) => {
    req.logger.error(`ERROR CODE: ${error}`)
    switch (error.code) {
        case EError.INVALID_JSON: 
        res.json({ status: "error",error: error.cause, message: error.message })
        break;
        case EError.DATABASE_ERROR:
        res.json({ status: "error", error: error.cause, message: error.message });
        break;
        case EError.INVALID_PARAM:
        res.json({ status: "error", error: error.cause, message: error.message });
        break;
        default:
        res.json({status: "error", message: "ocurrió un error, en caso de no resolverse comuniquese con el administrador"});
        break;

    }
   next();
}