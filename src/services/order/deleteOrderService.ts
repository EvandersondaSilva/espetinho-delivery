import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface DeleteOrderRequest {
    id: string;
}

class DeleteOrderService {
    async execute({ id }: DeleteOrderRequest) {
        try {
            const order = await prismaClient.order.delete({
                where: { id },
                select: orderSelect,
            });

            return order;
        } catch {
            throw new AppError("Falha ao cancelar pedido", 500);
        }
    }
}

export { DeleteOrderService };
