import UserDTO from "../../DTOs/userDTO.js";
import userModel from "../../models/User.model.js";


export default class UserManager {
    async getUserDTOFromSession(userSession) {
      const userDTO = new UserDTO(
        userSession.name,
        userSession.email,
        userSession.role,
        userSession.cart
      );
  
      return userDTO;
    }
   
  }