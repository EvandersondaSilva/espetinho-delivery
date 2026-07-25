import { z } from 'zod';

export const updateStoreStatusSchema = z.object({
    body: z.object({
        isStoreOpen: z.boolean({ message: "isStoreOpen precisa ser um boolean" }),
    }),
});

export const updateMinOrderValueSchema = z.object({
    body: z.object({
        minOrderValue: z.number().int().min(0, { message: "minOrderValue precisa ser um inteiro >= 0" }),
    }),
});
