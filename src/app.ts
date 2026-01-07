import express from "express";
import productRoutes from "./routes/product-route";
import orderRoutes from "./routes/order-route";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
