import prismaClient from "../../prisma"


class detailUserService {
    async execute(user_id: string) {

        try {

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
                throw new Error("Usuário não encontrado")
            }

            return user

        } catch (error) {
            throw new Error("Usuário não encontrado")
        }

    }
}

export { detailUserService }