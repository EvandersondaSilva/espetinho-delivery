import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { productSelect } from "../../prisma/selects";

interface DeleteProductRequest {
    id: string;
}

class DeleteProductService {
    async execute({ id }: DeleteProductRequest) {
        try {
            const product = await prismaClient.product.delete({
                where: { id },
                select: productSelect,
            });

            return product;
        } catch (error) {
            throw new AppError("Falha ao deletar produto", 500);
        }
    }
}

export { DeleteProductService };
