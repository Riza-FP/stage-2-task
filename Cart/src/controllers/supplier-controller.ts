import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/client";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middlewares/auth-middleware";



export const getMyProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.id) {
            return next(new AppError("Unauthorized", 401));
        }

        const products = await prisma.product.findMany({
            where: { ownerId: req.user.id }
        });

        res.status(200).json({
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        next(error);
    }
};

interface StockUpdate {
    supplierId: number;
    productId: number;
    amount: number;
}

export const updateSupplierStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updates: StockUpdate[] = req.body;

        if (!Array.isArray(updates) || updates.length === 0) {
            return next(new AppError("Request body must be an array of stock updates", 400));
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Extract IDs for Batch Read
            const supplierIds = Array.from(new Set(updates.map(u => u.supplierId)));
            const productIds = Array.from(new Set(updates.map(u => u.productId)));

            // 2. Batch Reads
            const suppliers = await tx.supplier.findMany({
                where: { id: { in: supplierIds } }
            });
            const products = await tx.product.findMany({
                where: { id: { in: productIds } }
            });

            // 3. Map for Validation & Calculation
            const supplierMap = new Map(suppliers.map(s => [s.id, s]));
            const productMap = new Map(products.map(p => [p.id, p]));
            // Track accumulated stock changes: productId -> currentCalculatedStock
            // Initialize with current DB values
            const stockState = new Map(products.map(p => [p.id, p.stock]));

            const stockLogs = [];
            const finalProductUpdates = new Map<number, number>();

            // 4. Processing & Validation
            for (const update of updates) {
                const { supplierId, productId, amount } = update;

                if (!supplierId || !productId || amount === undefined) {
                    throw new AppError("Invalid update item. Missing required fields.", 400);
                }

                if (!supplierMap.has(supplierId)) {
                    throw new AppError(`Supplier with ID ${supplierId} not found`, 404);
                }
                if (!productMap.has(productId)) {
                    throw new AppError(`Product with ID ${productId} not found`, 404);
                }

                const currentStock = stockState.get(productId)!;
                const newStock = currentStock + amount;

                if (newStock < 0) {
                    const productName = productMap.get(productId)?.name;
                    throw new AppError(`Stock update for Product ${productName} (ID: ${productId}) would result in negative stock: ${newStock}`, 400);
                }

                // Update state for subsequent iterations (in case same product is updated multiple times)
                stockState.set(productId, newStock);
                finalProductUpdates.set(productId, newStock);

                // Prepare log entry
                stockLogs.push({
                    supplierId,
                    productId,
                    amount
                });
            }

            // 5. Batch Writes
            // A. Create all Stock logs in one go
            await tx.stock.createMany({
                data: stockLogs
            });

            // B. Update Products (Promise.all for concurrency)
            const updatePromises = Array.from(finalProductUpdates.entries()).map(([id, stock]) => {
                return tx.product.update({
                    where: { id },
                    data: { stock }
                });
            });

            const updatedProducts = await Promise.all(updatePromises);

            return updatedProducts;
        });

        res.status(200).json({
            message: "Stock updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
