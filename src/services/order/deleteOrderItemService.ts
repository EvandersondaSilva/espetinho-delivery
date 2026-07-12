import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface DeleteOrderItemRequest {
    id: string;
}

class DeleteOrderItemService {
    async execute({ id }: DeleteOrderItemRequest) {
        try {
            return await prismaClient.$transaction(async (tx) => {
                const orderItem = await tx.orderItem.findUnique({
                    where: { id },
                    select: { id: true, orderId: true },
                });

                if (!orderItem) {
                    throw new AppError("Item do pedido não encontrado", 404);
                }

                const orderId = orderItem.orderId;

                const order = await tx.order.findUnique({
                    where: { id: orderId },
                    select: { deliveryFee: true },
                });

                if (!order) {
                    throw new AppError("Pedido não encontrado", 404);
                }

                await tx.orderItem.delete({
                    where: { id },
                });

                const items = await tx.orderItem.findMany({
                    where: { orderId },
                    select: { price: true, quantity: true },
                });

                const itemsTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                const total = itemsTotal + order.deliveryFee;

                const updated = await tx.order.update({
                    where: { id: orderId },
                    data: { total },
                    select: orderSelect,
                });

                return updated;
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Falha ao remover item do pedido", 500);
        }
    }
}

export { DeleteOrderItemService };
