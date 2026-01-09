import { Request, Response } from "express";
import { prisma } from "../connections/client";


export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error,
    });
  }
};


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items)) {
      return res.status(400).json({
        message: "userId and items are required",
      });
    }


    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(400).json({
          message: `Product with id ${item.productId} not found`,
        });
      }
    }


    const order = await prisma.order.create({
      data: {
        userId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create order",
      error,
    });
  }
};


export const getOrderSummary = async (req: Request, res: Response) => {
  try {
    const { limit = "10", offset = "0" } = req.query;

    const summary = await prisma.order.groupBy({
      by: ["userId"],
      _count: { id: true },
      orderBy: { userId: "asc" },
      take: Number(limit),
      skip: Number(offset),
    });

    const formatted = summary.map(item => ({
      userId: item.userId,
      totalOrders: item._count.id,
    }));

    res.json({
      message: "Order summary fetched successfully",
      data: formatted,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch order summary",
      error,
    });
  }
};
