import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

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
            throw new AppError("Falha ao criar categoria", 500)

        }
    }
}

export { CreateCategoryService }