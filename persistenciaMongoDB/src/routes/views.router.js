import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/products", (req, res) => {
  res.render("products");
});
router.get("/cart/:cid", (req, res) => {
  res.render("cart");
});
router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});
router.get("/chat", (req, res) => {
  res.render("chat");
});
export default router;
