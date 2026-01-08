import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/client";
import { AppError } from "../utils/AppError";

export const transferPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { senderId, receiverId, amount } = req.body;

        // 1. Validate input
        if (!senderId || !receiverId || !amount) {
            return next(new AppError("Sender, receiver, and amount are required", 400));
        }
        if (Number(amount) <= 0) {
            return next(new AppError("Amount must be greater than 0", 400));
        }
        if (senderId === receiverId) {
            return next(new AppError("Cannot transfer to yourself", 400));
        }

        // 2. Transaction
        const result = await prisma.$transaction(async (tx) => {
            // Check sender existence and balance
            const sender = await tx.user.findUnique({ where: { id: senderId } });
            if (!sender) {
                throw new AppError("Sender not found", 404);
            }
            if (sender.point < amount) {
                throw new AppError("Insufficient points", 400);
            }

            // Check receiver existence
            const receiver = await tx.user.findUnique({ where: { id: receiverId } });
            if (!receiver) {
                throw new AppError("Receiver not found", 404);
            }

            // Perform transfer
            const updatedSender = await tx.user.update({
                where: { id: senderId },
                data: { point: { decrement: amount } },
            });

            const updatedReceiver = await tx.user.update({
                where: { id: receiverId },
                data: { point: { increment: amount } },
            });

            return { sender: updatedSender, receiver: updatedReceiver };
        });

        return res.status(200).json({
            message: "Transfer successful",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};
