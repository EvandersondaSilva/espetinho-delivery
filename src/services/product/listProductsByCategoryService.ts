import prismaClient from "../../prisma";

class ListProductsByCategoryService {
    async execute(categoryId: string) {
        try {
            const categoryExists = await prismaClient.category.findFirst({
                where: { id: categoryId },
            });

            if (!categoryExists) {
                throw new Error("Category does not exist");
            }

            const products = await prismaClient.product.findMany({
                where: { categoryId },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    imageUrl: true,
                    available: true,
                    categoryId: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            });

            return products;
        } catch (error) {
            if (error instanceof Error && error.message === "Category does not exist") {
                throw error;
            }
            throw new Error("Falha ao listar produtos por categoria");
        }
    }
}

export { ListProductsByCategoryService };
