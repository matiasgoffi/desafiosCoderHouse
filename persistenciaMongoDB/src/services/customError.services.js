export default class CustomError {
    static createError({name="Error",cause,message,errorCode}){
        const error =  new Error(message);
        error.name = name;
         error.code = errorCode;
         error.cause = cause;
        throw  error; 
         
    }
}