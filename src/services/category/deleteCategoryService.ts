import prismaClient from "../../prisma";

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
            throw new Error("Falha ao deletar categoria");

        }
    }
}

export { DeleteCategoryService };
