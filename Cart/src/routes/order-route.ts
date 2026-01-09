import { Router } from "express";
import {
  getOrders,
  createOrder,
  getOrderSummary
} from "../controllers/order-controller";

const router = Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/summary", getOrderSummary);


export default router;
