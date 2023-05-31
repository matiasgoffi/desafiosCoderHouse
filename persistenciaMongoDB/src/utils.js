import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'; 


//funciones para el hasheo de password con bcrypt

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;