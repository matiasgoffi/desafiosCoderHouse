import { Router } from "express";

const router = Router();

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

router.get("/products", privateAcces, (req, res) => {
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
router.get('/resetPassword', publicAcces, (req,res)=>{
  res.render('resetPassword')
})
export default router;
