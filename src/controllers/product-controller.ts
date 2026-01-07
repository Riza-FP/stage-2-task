import { Request, Response } from "express";
import { products } from "../models/products";

export const getProducts = (req: Request, res: Response) => {
  res.json(products);
};

export const createProduct = (req: Request, res: Response) => {
  const { name, price } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};
