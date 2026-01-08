import express, { Request, Response, NextFunction } from "express";
import productRoutes from "./routes/product-route";
import orderRoutes from "./routes/order-route";
import userRoutes from "./routes/user-route";
import supplierRoutes from "./routes/supplier-route";
import { AppError } from "./utils/AppError";

const app = express();

app.use(express.json());

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
