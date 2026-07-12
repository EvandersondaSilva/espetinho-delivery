import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

interface UpdateCategoryRequest {
    id: string;
    name: string;
}

class UpdateCategoryService {
    async execute({ id, name }: UpdateCategoryRequest) {
        try {
            const category = await prismaClient.category.update({
                where: {
                    id: id
                },
                data: {
                    name: name
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                }
            });

            return category;

        } catch (error) {
            throw new AppError("Falha ao editar categoria", 500);

        }
    }
}

export { UpdateCategoryService };
