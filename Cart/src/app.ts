import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product-route";
import orderRoutes from "./routes/order-route";
import userRoutes from "./routes/user-route";
import supplierRoutes from "./routes/supplier-route";
import { AppError } from "./utils/AppError";

const app = express();

// CORS
app.use(cors({
  origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:8081"],
  credentials: true // Important for cookies
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/suppliers", supplierRoutes);

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status: status,
    message: err.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
