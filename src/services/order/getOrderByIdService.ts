import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface GetOrderByIdRequest {
    id: string;
}

class GetOrderByIdService {
    async execute({ id }: GetOrderByIdRequest) {
        try {
            const order = await prismaClient.order.findUnique({
                where: { id },
                select: orderSelect,
            });

            if (!order) {
                throw new AppError("Pedido não encontrado", 404);
            }

            return order;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Falha ao buscar pedido", 500);
        }
    }
}

export { GetOrderByIdService };
