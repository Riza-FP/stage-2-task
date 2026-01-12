import { Request, Response } from "express";
import { prisma } from "../connections/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../utils/validation";
import { AppError } from "../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "cart-secret-key";

export const loginSupplier = async (req: Request, res: Response, next: any) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }

        const { email, password } = value;

        const supplier = await prisma.supplier.findUnique({ where: { email } });
        if (!supplier) {
            throw new AppError("Invalid email or password", 401);
        }

        const isValidPassword = await bcrypt.compare(password, supplier.password);
        if (!isValidPassword) {
            throw new AppError("Invalid email or password", 401);
        }

        const token = jwt.sign(
            { id: supplier.id, email: supplier.email, role: "supplier" },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            maxAge: 3600000 // 1 hour
        });

        res.json({
            message: "Login successful",
            token // Optional: keep returning it for flexibility, or remove if strict session-only
        });
    } catch (error) {
        next(error);
    }
};
