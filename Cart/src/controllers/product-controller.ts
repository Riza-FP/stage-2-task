import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/client";
import { productSchema } from "../utils/validation";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middlewares/auth-middleware";

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


export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Ensure the user is a supplier (controlled by middleware, but good to have type safety)
    const supplierId = req.user?.id;
    if (!supplierId) {
      throw new AppError("Unauthorized: Supplier ID missing", 401);
    }

    const { name, price, stock, description } = value;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock: stock || 0,
        description,
        ownerId: supplierId
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    // Authorization Check: Only owner can update
    if (existingProduct.ownerId !== req.user?.id) {
      throw new AppError("Forbidden: You do not own this product", 403);
    }

    const { name, price, stock, description } = value;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        stock,
        description,
      },
    });

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};


export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    // Authorization Check
    if (existingProduct.ownerId !== req.user?.id) {
      throw new AppError("Forbidden: You do not own this product", 403);
    }

    await prisma.product.delete({
      where: { id }
    });

    return res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};



