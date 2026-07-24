import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface MarkOrderPrintedRequest {
    id: string;
}

class MarkOrderPrintedService {
    async execute({ id }: MarkOrderPrintedRequest) {
        const orderExists = await prismaClient.order.findUnique({
            where: { id },
        });

        if (!orderExists) {
            throw new AppError("Pedido não encontrado", 404);
        }

        try {
            const order = await prismaClient.order.update({
                where: { id },
                data: { autoPrinted: true },
                select: orderSelect,
            });

            return order;
        } catch {
            throw new AppError("Falha ao marcar pedido como impresso", 500);
        }
    }
}

export { MarkOrderPrintedService };
