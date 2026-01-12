import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "cart-secret-key";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateSupplier = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Check cookie
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new AppError("Unauthorized: No token provided", 401));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError("Forbidden: Invalid or expired token", 403));
    }
};
