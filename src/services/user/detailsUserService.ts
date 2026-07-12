import prismaClient from "../../prisma"
import { AppError } from "../../errors/AppError"

class DetailUserService {
    async execute(user_id: string) {
        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })

        if (!user) {
            throw new AppError("Usuário não encontrado", 404)
        }

        return user
    }
}

export { DetailUserService }