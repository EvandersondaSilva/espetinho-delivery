import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface ListOrdersRequest {
    page: number;
    limit: number;
    status?: "RECEBIDO" | "PREPARANDO" | "SAIU" | "ENTREGUE";
}

class ListOrdersService {
    async execute({ page, limit, status }: ListOrdersRequest) {
        try {
            const orders = await prismaClient.order.findMany({
                where: status ? { status } : {},
                select: orderSelect,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit + 1, // busca 1 extra so pra saber se tem mais uma pagina
            });

            const hasMore = orders.length > limit;

            return {
                orders: hasMore ? orders.slice(0, limit) : orders,
                page,
                limit,
                hasMore,
            };
        } catch {
            throw new AppError("Falha ao listar pedidos", 500);
        }
    }
}

export { ListOrdersService };
