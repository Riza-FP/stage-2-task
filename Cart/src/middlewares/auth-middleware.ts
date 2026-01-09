import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "cart-secret-key";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateSupplier = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return next(new AppError("Forbidden: Invalid token", 403));
            }

            req.user = user;
            next();
        });
    } else {
        next(new AppError("Unauthorized: No token provided", 401));
    }
};
