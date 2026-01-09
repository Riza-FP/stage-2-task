import express from "express";
import { updateSupplierStock, getMyProducts } from "../controllers/supplier-controller";
import { loginSupplier } from "../controllers/supplier-auth-controller";
import { authenticateSupplier } from "../middlewares/auth-middleware";

const router = express.Router();

router.post("/login", loginSupplier);
router.get("/products", authenticateSupplier, getMyProducts);
router.post("/stock", updateSupplierStock); // Optionally protect this too?

export default router;
