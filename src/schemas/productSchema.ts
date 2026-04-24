import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }),
        price: z.string().min(1, { message: "Price is required" }),
        description: z.string().optional(),
        categoryId: z.string().min(1, { message: "Category ID is required" }),

    })
})

export const listProductsByCategorySchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id da categoria e obrigatorio" }),
    }),
})

export const updateProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do produto e obrigatorio" }),
    }),
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }),
        price: z.string().min(1, { message: "Price is required" }),
        description: z.string().optional(),
        categoryId: z.string().min(1, { message: "Category ID is required" }),
    }),
})

export const deleteProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do produto e obrigatorio" }),
    }),
})

export const disableProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do produto e obrigatorio" }),
    }),
})

export const enableProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do produto e obrigatorio" }),
    }),
})