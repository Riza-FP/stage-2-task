import { Request, Response } from "express";
import { prisma } from "../connections/client";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      sortBy,
      order = "asc",
      minPrice,
      maxPrice,
      minStock,
      limit = "10",
      offset = "0",
    } = req.query;

    const where: any = {};

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice as string);
      if (maxPrice) where.price.lte = Number(maxPrice as string);
    }

    if (minStock) {
      where.stock = { gte: Number(minStock) };
    }

    const orderBy =
      sortBy === "price" || sortBy === "stock"
        ? { [sortBy]: order }
        : undefined;

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: Number(limit),
      skip: Number(offset),
    });

    res.json({
      message: "Products fetched successfully",
      data: products,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch products",
      error,
    });
  }
};


export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        message: "Name, price, and stock are required"
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        stock
      }
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create product",
      error
    });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, price, description, stock } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        stock
      }
    });

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {

    return res.status(500).json({
      message: "Failed to update product",
      error
    });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    return res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
      error
    });
  }
};



