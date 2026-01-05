import express from "express";
import { getPosts, createPost, deletePost } from "../controllers/post-controller";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.delete("/:id", deletePost);


export default router;