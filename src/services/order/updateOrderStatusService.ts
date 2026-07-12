import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface UpdateOrderStatusRequest {
    id: string;
    status: "RECEBIDO" | "PREPARANDO" | "SAIU" | "ENTREGUE";
}

class UpdateOrderStatusService {
    async execute({ id, status }: UpdateOrderStatusRequest) {
        const orderExists = await prismaClient.order.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!orderExists) {
            throw new AppError("Pedido não encontrado", 404);
        }

        try {
            const order = await prismaClient.order.update({
                where: { id },
                data: { status },
                select: orderSelect,
            });

            return order;
        } catch {
            throw new AppError("Falha ao atualizar status do pedido", 500);
        }
    }
}

export { UpdateOrderStatusService };
