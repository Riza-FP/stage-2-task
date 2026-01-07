import express from "express";
import { getPosts, createPost, updatePost, deletePost, getPostComments, getCommentsSummary } from "../controllers/post-controller";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.get("/comments-summary", getCommentsSummary);
router.get("/:id/comments", getPostComments);


export default router;