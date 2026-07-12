import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { productSelect } from "../../prisma/selects";

class ListProductService {
    async execute() {
        try {
            const products = await prismaClient.product.findMany({
                select: productSelect,
                orderBy: { createdAt: "desc" },
            });

            return products;
        } catch (error) {
            throw new AppError("Falha ao listar produtos", 500);
        }
    }
}

export { ListProductService };
