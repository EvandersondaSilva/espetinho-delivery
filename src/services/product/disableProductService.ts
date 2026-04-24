import prismaClient from "../../prisma";

interface DisableProductRequest {
    id: string;
}

class DisableProductService {
    async execute({ id }: DisableProductRequest) {
        const productExists = await prismaClient.product.findFirst({
            where: { id },
        });

        if (!productExists) {
            throw new Error("Product does not exist");
        }

        try {
            const product = await prismaClient.product.update({
                where: { id },
                data: {
                    available: false,
                },
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
            });

            return product;
        } catch {
            throw new Error("Falha ao desabilitar produto");
        }
    }
}

export { DisableProductService };
