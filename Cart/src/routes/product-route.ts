import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product-controller";
import { uploadProductImage as uploadController } from "../controllers/upload-controller"; // Renamed to avoid alias conflict if needed, or just import
import { uploadProductImage } from "../middlewares/upload-middleware";
import { authenticateSupplier } from "../middlewares/auth-middleware";

const router = Router();

router.get("/", getProducts);
router.post("/upload-image", authenticateSupplier, uploadProductImage.single("image"), uploadController);
router.post("/", authenticateSupplier, createProduct);
router.put("/:id", authenticateSupplier, updateProduct);
router.delete("/:id", authenticateSupplier, deleteProduct);

export default router;
