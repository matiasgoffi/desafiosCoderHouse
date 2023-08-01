import {fileURLToPath} from 'url';
import { dirname } from 'path';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'; 
import { Faker, en } from '@faker-js/faker';

//faker js 
export const customFaker = new Faker ({
locale: [en],
});

const { database, commerce, number, datatype, image } = customFaker;

//PODRIA GENERAR UN ARRAY DE IMAGENES DE SER NECESARIO PARA CUMPLIR CON THUMBNAILS = [STRING]

export const generateProduct = () => {
    return { 
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: commerce.price(),
        code: number.int(),
        status: datatype.boolean(),
        thumbnails: image.url(),
        stock: number.int(),
        category: commerce.department(),
    }
}

//funciones para el hasheo de password con bcrypt

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

//funciones para recuperar/generar nueva contraseña
export const generateEmailToken = (email, expireTime)=>{
    const token = jwt.sign({email},"goffimatias@gmail.com", {expiresIn:expireTime})
    return token
}
export const verifyEmailToken = (token) =>{
    try {
        const info = jwt.verify(token,"goffimatias@gmail.com");
        return info.email;
    } catch (error) {
        console.log(error.message)
        return null
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;