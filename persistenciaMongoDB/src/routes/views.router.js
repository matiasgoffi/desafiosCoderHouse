import { Router } from "express";
import compression from "express-compression";

const router = Router();

const adminAcces = (req,res,next) =>{
  if (req.session.user  && req.session.user.role !== "admin") {
    return res.redirect("/products");
  }
  next();
}
const publicAcces = (req,res,next) =>{
  if (req.session.user && req.path !== "/resetPassword" && req.session.user.role !== "user") {
    return res.redirect("/products");
  }
  next();
}

const userAcces = (req,res,next) =>{
  if (!req.session.user || req.session.user.role !== "user") {
    return res.redirect("/");
  }
  next();
}

const privateAcces = (req,res,next)=>{
  if(!req.session.user) return res.redirect('/');
  next();
}

router.get("/products", privateAcces, compression({brotli:{enable:true,zlib:{}}}),(req, res) => {
  res.render('products',{
    user: req.session.user
})
});

router.get("/cart/:cid", privateAcces,  (req, res) => {
  res.render('cart',{
    user: req.session.user
})
});
router.get("/realtimeproducts",  privateAcces, (req, res) => {
  res.render('realtimeproducts',{
    user: req.session.user
})
});
router.get("/chat", publicAcces, userAcces, (req, res) => {
  res.render("chat");
});
router.get('/register', publicAcces, (req,res)=>{
  res.render('register')
})

router.get('/', publicAcces, (req,res)=>{
  res.render('login')
})
router.get("/failLogin", (req,res)=>{
  res.render("failLogin") ;
}); // Agrega esta línea para la vista "faillogin"

router.get("/forgot-password",(req,res)=>{
  res.render("forgotPassword");
});

router.get("/reset-password",(req,res)=>{
  const token = req.query.token;
  res.render("resetPassword",{token});
});
router.get("/users", adminAcces,  (req, res) => {
  res.render('users')
});

export default router;
