import express, { Request, Response, NextFunction } from "express";
import postRoutes from "./routes/post-route";
import userRoutes from "./routes/user-route";
import authRoutes from "./routes/auth-route";
import { AppError } from "./utils/AppError";

const app = express()

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});