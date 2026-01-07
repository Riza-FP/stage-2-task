import express from "express";
import postRoutes from "./routes/post-route";


const app = express()
const PORT = 3000

app.use(express.json());

app.use("/api/v1/posts", postRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})