import userModel from "../Dao/models/User.model.js";

class UserController{
    static updateUserDocument = async (req, res, next) => {
        try {
            const userId = req.params.uid;
            const user = await userModel.findById(userId);
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            const docs = [];
            if (identificacion){
                docs.push({name: "identificacion", reference: identificacion.filename})
            }
            if (domicilio){
                docs.push({name: "domicilio", reference: domicilio.filename})
            }
            if (estadoDeCuenta){
                docs.push({name: "estadoDeCuenta", reference: estadoDeCuenta.filename})
            }
            if (docs.length === 3){
                user.status = "completo";
            } else {
                user.status = "incompleto";
            }
            user.documents = docs;
            const userUpdate = await userModel.findByIdAndUpdate(user._id, user)

            res.json({status: "success", message: "Documentos actualizados correctamente."})

        } catch (error) { 
            console.log(error.message);
            res.json({status: "error", message: "hubo un error en la carga de los documentos."})
        }


    }

}

export {UserController}