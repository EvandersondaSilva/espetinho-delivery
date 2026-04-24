import prismaClient from "../../prisma";

class ListProductService {
    async execute() {
        try {
            const products = await prismaClient.product.findMany({
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
            throw new Error("Falha ao listar produtos");
        }
    }
}

export { ListProductService };
