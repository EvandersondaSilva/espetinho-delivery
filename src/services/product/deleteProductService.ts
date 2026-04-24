import prismaClient from "../../prisma";

interface DeleteProductRequest {
    id: string;
}

class DeleteProductService {
    async execute({ id }: DeleteProductRequest) {
        try {
            const product = await prismaClient.product.delete({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    imageUrl: true,
                    categoryId: true,
                    createdAt: true,
                },
            });

            return product;
        } catch (error) {
            throw new Error("Falha ao deletar produto");
        }
    }
}

export { DeleteProductService };
