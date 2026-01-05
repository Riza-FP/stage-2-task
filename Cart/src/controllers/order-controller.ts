import { Request, Response } from "express";
import { orders } from "../models/orders";
import { products } from "../models/products";

export const getOrders = (req: Request, res: Response) => {
    res.json(orders);
};

export const createOrder = (req: Request, res: Response) => {
    const { items } = req.body;

    for (const item of items) {
        const productExists = products.some(
            product => product.id === item.productId
        );

        if (!productExists) {
            return res.status(400).json({
                message: `Product with id ${item.productId} not found`
            });
        }
    }

    const newOrder = {
        id: orders.length + 1,
        items
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
};
