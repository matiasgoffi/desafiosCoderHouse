import passport from "passport";
import local from "passport-local";
import userService from "../Dao/models/User.model.js";
import GitHubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils.js";
import { config } from "./config.js";

const LocalStrategy = local.Strategy;
export let currentRole;
export let currentEmail;
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userService.findOne({ email: username });
          if (user) {
            req.logger.error("el usuario no existe")
            return done(null, false);
            
          }

          let role;
          if(email=== config.auth.account && password === config.auth.pass){
            role = "admin";
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role
          };

          const result = await userService.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al registrar el usuario: " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await userService.findOne({ email: username });
          if(user){
          currentRole = user.role;
          currentEmail = user.email;
          }
          if (!user) {
            req.logger.error("El usuario no existe");
            return done(null, false);
          }
          
          // Aquí deberías verificar la contraseña utilizando la función validatePassword
          if (!validatePassword(password, user)) {
            req.logger.error("Contraseña incorrecta");
            return done(null, false);
          }
  
          return done(null, user);
        } catch (error) {
          return done("Error al intentar ingresar: " + error);
        }
      }
    )
  );

/*   passport.use(
    "login",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await userService.findOne({ email: username });
          currentRole = user.role;
          currentEmail = user.email;
          if (!user) {
            req.logger.error("el usuario no existe")
            return done(null, false);
          }
          if (!validatePassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done("Error al intentar ingresar: " + error);
        }
      }
    )
  ); */
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userService.findById(id);
    done(null, user);
  });

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          req.logger.info(profile)

          let email = profile._json.email;
          if (!email) {
            email = profile._json.login;
          }

          const user = await userService.findOne({
            email: email,
          });
          currentEmail = user.email;//chequear de recibir el email de quien se loguea en github y no el nombre de usuario
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: email,
              age: 31,
              password: "",
            };
            const result = await userService.create(newUser);
            done(null, result);
          } else {
            
           
            //ya existe el usuario
            done(null, user);
          }
        } catch (error) {
          return done(null, error);
        }
      }
    )
  );
};

export default initializePassport;
