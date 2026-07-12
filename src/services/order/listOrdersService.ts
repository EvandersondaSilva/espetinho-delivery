import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

class ListOrdersService {
    async execute() {
        try {
            const orders = await prismaClient.order.findMany({
                select: orderSelect,
                orderBy: { createdAt: "desc" },
            });

            return orders;
        } catch {
            throw new AppError("Falha ao listar pedidos", 500);
        }
    }
}

export { ListOrdersService };

