import { z } from 'zod'


export const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ message: "Categoria precisa ser um texto" }).min(2, { message: "Nome da categoria precisa ter 3 caracteres" })
    })
})

export const updateCategorySchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id da categoria e obrigatorio" })
    }),
    body: z.object({
        name: z.string({ message: "Categoria precisa ser um texto" }).min(3, { message: "Nome da categoria precisa ter 3 caracteres" })
    })
})

export const deleteCategorySchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id da categoria e obrigatorio" })
    })
})

