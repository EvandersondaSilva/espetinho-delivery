import { z } from 'zod'

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(3, { message: "O nome precisa ter no minimo 3 letras" }),
        email: z.email({ message: "digite um email válido" }),
        password: z.string().min(6, { message: "A senha deve ter no minimo 6 caracteres" })
    })
})

export const authUserSchema = z.object({
    body: z.object({
        email: z.email({ message: "digite um email válido" }),
        password: z.string({ message: "A senha é obrigatória" }).min(1, { message: "A senha é obrigatória" })
    })
})