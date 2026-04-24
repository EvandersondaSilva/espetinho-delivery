import prismaClient from "../../prisma";

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
            throw new Error("Falha ao editar categoria");

        }
    }
}

export { UpdateCategoryService };
