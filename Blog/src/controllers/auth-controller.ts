import { Request, Response } from "express";
import { prisma } from "../connections/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../utils/validation";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const login = async (req: Request, res: Response) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = value;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
};
