import { z } from 'zod';

export const updateStoreStatusSchema = z.object({
    body: z.object({
        isStoreOpen: z.boolean({ message: "isStoreOpen precisa ser um boolean" }),
    }),
});
