import winston from "winston";
import __dirname from "../utils.js";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'bold red',
    error: 'red',
    warning: 'yellow',
    info: 'white',
    http: 'blue',
    debug: 'gray',
  }
};


const devlogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.colorize({colors: customLevelsOptions.colors}),
          winston.format.simple()
        )
     }),
    ],
  });
  
  const prodlogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.File({ 
        filename: path.join(__dirname, "./errors.log"),
         level: 'error',
        format:winston.format.simple()
        }),
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.colorize({colors: customLevelsOptions.colors}),
          winston.format.simple()
        )
      }),
    ],
  });


export const addLogger = (req, res, next) => {
  if (process.env.NODE_ENV ==="production"){
  req.logger= prodlogger
  } else {
   req.logger= devlogger
  }
  req.logger.http(`${req.method} en ${req.url}`)
  next();
}