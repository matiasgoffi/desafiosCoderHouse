import { Router } from "express";

const router = Router();

const publicAcces = (req,res,next) =>{
  if (req.session.user && req.path !== "/resetPassword") {
    return res.redirect("/products");
  }
  next();
}

const privateAcces = (req,res,next)=>{
  if(!req.session.user) return res.redirect('/');
  next();
}
/* const adminAccess = (req,res,next)=>{
  if(!req.session.user.rol !== 'Admin') return res.redirect('/');
  next();
}
 */
router.get("/products", privateAcces, (req, res) => {
  res.render('products',{
    user: req.session.user
})
});

router.get("/cart/:cid", privateAcces, (req, res) => {
  res.render('cart',{
    user: req.session.user
})
});
router.get("/realtimeproducts",  privateAcces, (req, res) => {
  res.render('realtimeproducts',{
    user: req.session.user
})
});
router.get("/chat", publicAcces, (req, res) => {
  res.render("chat");
});
router.get('/register', publicAcces, (req,res)=>{
  res.render('register')
})

/* router.get('/users', privateAcces, adminAccess, async (req,res)=>{
  const users = await userModel.find().lean()
  const user = req.session.user;
  console.log(user)
  res.render('users', {
    users, user
  })
}) */

router.get('/', publicAcces, (req,res)=>{
  res.render('login')
})
router.get('/resetPassword', publicAcces, (req,res)=>{
  res.render('resetPassword')
})
export default router;
