import prismaClient from "../../prisma";

interface CreateCategoryResponse {
    name: string;
}

class CreateCategoryService {
    async execute({ name }: CreateCategoryResponse) {
        try {

            const category = await prismaClient.category.create({
                data: {
                    name: name
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                }
            })

            return category

        } catch (error) {
            throw new Error("Falha ao criar categoria")

        }
    }
}

export { CreateCategoryService }