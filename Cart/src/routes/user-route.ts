import express from "express";
import { transferPoints } from "../controllers/user-controller";

const router = express.Router();

router.post("/transfer-points", transferPoints);

export default router;