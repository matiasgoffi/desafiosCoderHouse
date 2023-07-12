import {fileURLToPath} from 'url';
import { dirname } from 'path';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;