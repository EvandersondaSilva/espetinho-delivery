import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

interface DeleteCategoryRequest {
    id: string;
}

class DeleteCategoryService {
    async execute({ id }: DeleteCategoryRequest) {
        try {
            const category = await prismaClient.category.delete({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                }
            });

            return category;

        } catch (error) {
            throw new AppError("Falha ao deletar categoria", 500);

        }
    }
}

export { DeleteCategoryService };
