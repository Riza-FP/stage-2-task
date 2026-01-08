import express from "express";
import { updateSupplierStock } from "../controllers/supplier-controller";

const router = express.Router();

router.post("/stock", updateSupplierStock);

export default router;