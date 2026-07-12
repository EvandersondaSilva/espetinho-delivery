import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { productSelect } from "../../prisma/selects";

class ListProductsByCategoryService {
    async execute(categoryId: string) {
        try {
            const categoryExists = await prismaClient.category.findFirst({
                where: { id: categoryId },
            });

            if (!categoryExists) {
                throw new AppError("Categoria não encontrada", 404);
            }

            const products = await prismaClient.product.findMany({
                where: { categoryId },
                select: productSelect,
                orderBy: { createdAt: "desc" },
            });

            return products;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Falha ao listar produtos por categoria", 500);
        }
    }
}

export { ListProductsByCategoryService };
