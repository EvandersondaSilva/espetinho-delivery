import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

interface CreateCategoryResponse {
    name: string;
    displayOrder?: number;
}

class CreateCategoryService {
    async execute({ name, displayOrder }: CreateCategoryResponse) {
        try {

            const category = await prismaClient.category.create({
                data: {
                    name: name,
                    ...(displayOrder !== undefined && { displayOrder }),
                },
                select: {
                    id: true,
                    name: true,
                    displayOrder: true,
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