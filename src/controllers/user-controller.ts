import { Request, Response } from "express";
import { prisma } from "../connections/client";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: { name, email }
    });

    res.status(201).json({
      message: "User created",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true }
    });

    res.json({
      message: "Users fetched",
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email }
    });

    res.json({
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

