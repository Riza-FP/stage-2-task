import { Request, Response } from "express";
import { prisma } from "../connections/client";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
    });

    res.json({
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, userId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: Number(userId),
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" })
    }

    const postExists = await prisma.post.findUnique({
      where: { id },
    });

    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    res.json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update post",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" })
    }

    const postExists = await prisma.post.findUnique({
      where: { id },
    });

    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};
