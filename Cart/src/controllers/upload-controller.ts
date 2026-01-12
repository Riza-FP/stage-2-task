import { Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const uploadProductImage = (req: Request, res: Response) => {
    if (!req.file) {
        throw new AppError("No file uploaded. Please upload a valid image.", 400);
    }

    const filePath = req.file.path;

    res.status(200).json({
        status: "success",
        message: "File uploaded successfully",
        data: {
            filename: req.file.filename,
            path: filePath,
            size: req.file.size
        }
    });
};
