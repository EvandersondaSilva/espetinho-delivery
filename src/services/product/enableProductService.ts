import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { productSelect } from "../../prisma/selects";

interface EnableProductRequest {
    id: string;
}

class EnableProductService {
    async execute({ id }: EnableProductRequest) {
        const productExists = await prismaClient.product.findFirst({
            where: { id },
        });

        if (!productExists) {
            throw new AppError("Produto não encontrado", 404);
        }

        try {
            const product = await prismaClient.product.update({
                where: { id },
                data: { available: true },
                select: productSelect,
            });

            return product;
        } catch {
            throw new AppError("Falha ao habilitar produto", 500);
        }
    }
}

export { EnableProductService };
