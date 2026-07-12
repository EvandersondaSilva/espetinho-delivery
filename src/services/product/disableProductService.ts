import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { productSelect } from "../../prisma/selects";

interface DisableProductRequest {
    id: string;
}

class DisableProductService {
    async execute({ id }: DisableProductRequest) {
        const productExists = await prismaClient.product.findFirst({
            where: { id },
        });

        if (!productExists) {
            throw new AppError("Produto não encontrado", 404);
        }

        try {
            const product = await prismaClient.product.update({
                where: { id },
                data: { available: false },
                select: productSelect,
            });

            return product;
        } catch {
            throw new AppError("Falha ao desabilitar produto", 500);
        }
    }
}

export { DisableProductService };
