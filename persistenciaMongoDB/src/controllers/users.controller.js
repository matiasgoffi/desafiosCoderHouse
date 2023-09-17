import UserDTO from "../Dao/DTOs/userDTO.js";
import userModel from "../Dao/models/User.model.js";
import { transport } from "../config/gmail.js";

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
    
    static getUsers = async (req, res, next) => {
        try {
            let users = await userModel.find()
            console.log(users)
            let usersDTO = []
            for (let index = 0; index < users.length; index++) {
                let user = new UserDTO(
                  users[index]._id,  
                  users[index].first_name,
                  users[index].email,
                  users[index].role,
                  users[index].cart
                );
                usersDTO.push(user);
            }
            res.send({status:"success", message: usersDTO});

        } catch (error) { 
            console.log(error.message);
            res.json({status: "error", message: "hubo un error al obtener los usuarios."})
        }
    }

    static deleteInactiveUsers = async (req, res, next) => {
        try {
            let users = await userModel.find()
            let deletedUsers = [];
            for (let index = 0; index < users.length; index++) {  
                // Obtén la fecha actual
                const fechaActual = new Date();
                // Resta 2 días a la fecha actual
                fechaActual.setDate(fechaActual.getDate() - 2);
                 // Compara las fechas
                if (users[index].last_connection < fechaActual || users[index].last_connection === null) {
                        const deleteUser = await userModel.findOneAndDelete({ _id: users[index].id });
                        deletedUsers.push(deleteUser)
                        //ENVIAR MAIL CONFIRMANDO ELIMINACION
                        let contenidoMail = await transport.sendMail({
                         from:'ecommerce Universo Calzado',
                         to: users[index].email,
                        subject:'Eliminación de su cuenta',
                        html:`
                        <div>
                          <h1>Actualizaciones en su cuenta</h1>
                         <br>
                         <h5>Estimado/a: <strong>${users[index].first_name}</strong></h5>
                         <h5>Hemos eliminado su cuenta registrada con el email: <strong>${users[index].email} </strong> por inactividad</h5>
                         <h5>Por favor vuelva a registrarse para operar en el sitio.</h5>
                         <h5>Universo Calzado</h5>
                        </div>
                     `
                    })
                }
            }
            res.send({status:"success", message: deletedUsers});

        } catch (error) { 
            console.log(error.message);
            res.json({status: "error", message: "hubo un error al eliminar usuarios."})
        }
    }

}

export {UserController}