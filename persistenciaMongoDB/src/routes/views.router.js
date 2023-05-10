import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});
router.get("/chat", (req, res) => {
  res.render("chat");
});
export default router;
