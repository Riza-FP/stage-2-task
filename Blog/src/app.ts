import express from "express";
import postRoutes from "./routes/post-route";
import userRoutes from ".routes/user-route"


const app = express()
const PORT = 3000

app.use(express.json());

app.use("api/v1/users", userRoutes)
app.use("/api/v1/posts", postRoutes)


app.listen(process.env.PORT, () => {
    console.log("Server is running");
})