import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const productSchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).optional(),
    description: Joi.string().optional(),
});
