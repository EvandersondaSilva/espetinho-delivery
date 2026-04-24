import prismaClient from "../../prisma";

interface EnableProductRequest {
    id: string;
}

class EnableProductService {
    async execute({ id }: EnableProductRequest) {
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
                    available: true,
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
            throw new Error("Falha ao habilitar produto");
        }
    }
}

export { EnableProductService };
