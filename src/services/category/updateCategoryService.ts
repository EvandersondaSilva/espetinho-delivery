import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

interface UpdateCategoryRequest {
    id: string;
    name: string;
    displayOrder?: number;
}

class UpdateCategoryService {
    async execute({ id, name, displayOrder }: UpdateCategoryRequest) {
        try {
            const category = await prismaClient.category.update({
                where: {
                    id: id
                },
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
            });

            return category;

        } catch (error) {
            throw new AppError("Falha ao editar categoria", 500);

        }
    }
}

export { UpdateCategoryService };
