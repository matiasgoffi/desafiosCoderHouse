import { Router } from "express";
import userModel from "../Dao/models/User.model.js";
import accessMiddleware from "../middlewares/accessMiddleware.js";
import { checkAuthenticated } from "../middlewares/auth.js";
import { UserController } from "../controllers/users.controller.js";
import { uploaderDocument } from "../utils.js";

const router = Router();

router.put("/premium/:uid", accessMiddleware("admin") , async(req,res)=>{
    try {
        const userId = req.params.uid;
        //verificar si el usuario existe en la base de datos
        const user = await userModel.findById(userId);
        const userRol = user.role;
        if(userRol === "user"){
            user.role = "premium"
        } else if(userRol === "premium"){
            user.role = "user"
        } else {
            return res.json({status:"error", message:"no es posible cambiar el role del usuario"});
        }
        await userModel.updateOne({_id:user._id},user);
        res.send({status:"success", message:"rol modificado"});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error", message:"hubo un error al cambiar el rol del usuario"})
    }
});
router.put("/:uid/documents", 
    checkAuthenticated, uploaderDocument.fields([{name: "identificacion", maxCount:1},{name: "domicilio", maxCount:1},{name: "estadoDeCuenta", maxCount:1}]), 
    UserController.updateUserDocument
    )

export {router as usersRouter};