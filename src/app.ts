import express from "express";
import productRoutes from "./routes/product-route";
import orderRoutes from "./routes/order-route";

const app = express();

app.use(express.json());

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
