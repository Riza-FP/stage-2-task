import { Request, Response } from "express";
import { Post, posts } from "../models/post-model";

export const getPosts = (req: Request, res: Response) => {
    res.json(posts);
};

export const createPost = (req: Request, res: Response) => {
    const { title, content } = req.body;

    const newPost: Post = {
        id: posts.length + 1,
        title,
        content

    }

    posts.push(newPost)
    res.status(201).json(newPost)

};

export const deletePost = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const index = posts.findIndex(post => post.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  posts.splice(index, 1);

  res.json({ message: "Post deleted" });
};