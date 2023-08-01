import dotenv from "dotenv";
import __dirname from "../utils.js";
import path from "path";
import { Command } from 'commander';


const program = new Command();

program
.option("-mode <modo>", "modo de inicio", "dev")
program.parse(); //se cierra la configuracion

const enviroment = program.opts();
console.log(enviroment);

const pathEnviroment = enviroment.Mode === "prod" ? path.join(__dirname, "./.env.production") : path.join(__dirname, "./.env.development") 

dotenv.config({path: pathEnviroment});


const PORT=process.env.PORT;
const MONGO_URL=process.env.MONGO_URL;
const CORREO_ADMIN=process.env.CORREO_ADMIN;
const PASSWORD_ADMIN=process.env.PASSWORD_ADMIN;
const SECRET=process.env.SECRET;
const CLIENTIDGITHUB=process.env.CLIENTIDGITHUB;
const CLIENTSECRETGITHUB=process.env.CLIENTSECRETGITHUB

export const config = {
    server: {
        port: PORT
    },
    mongo: {
        url: MONGO_URL,
        secret: SECRET
    },
    auth: {
        account: CORREO_ADMIN,
        pass: PASSWORD_ADMIN
    },
    github: {
        clientSecret: CLIENTSECRETGITHUB, 
        clientId: CLIENTIDGITHUB
    }
}