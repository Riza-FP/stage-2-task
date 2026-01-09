import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product-controller";
import { authenticateSupplier } from "../middlewares/auth-middleware";

const router = Router();

router.get("/", getProducts);
router.post("/", authenticateSupplier, createProduct);
router.put("/:id", authenticateSupplier, updateProduct);
router.delete("/:id", authenticateSupplier, deleteProduct);

export default router;
