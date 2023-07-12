import { Router } from "express";
import { generateProduct } from "../utils.js";
import compression from "express-compression";


const router = Router();


// ruta MOCKING PRODUCTS faker js
router.get("/mockingproducts", compression({brotli:{enable:true,zlib:{}}}),async(req, res)=>{
    const cant = parseInt(req.query.cant) || 100
    let products = [];
    for (let index = 0; index < cant; index++) {
      const product = generateProduct();
      products.push(product);
    }
    res.json({products});
  });

export default router;