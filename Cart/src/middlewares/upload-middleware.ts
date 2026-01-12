import multer from "multer";
import path from "path";
import { Request } from "express";
import { AppError } from "../utils/AppError";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError("Invalid file type. Only JPEG, PNG, and JPG are allowed.", 400) as any, false);
    }
};

export const uploadProductImage = multer({
    storage: storage,
    fileFilter: fileFilter as any,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB limit
    },
});
