import prismaClient from "../../prisma";
import { orderItemSelect } from "./addOrderItemService";

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
                    throw new Error("Item do pedido nao encontrado");
                }

                const orderId = orderItem.orderId;

                const order = await tx.order.findUnique({
                    where: { id: orderId },
                    select: { deliveryFee: true },
                });

                if (!order) {
                    throw new Error("Pedido nao encontrado");
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
                    select: {
                        id: true,
                        customerName: true,
                        phone: true,
                        address: true,
                        deliveryFee: true,
                        total: true,
                        status: true,
                        createdAt: true,
                        items: {
                            select: orderItemSelect,
                        },
                    },
                });

                return updated;
            });
        } catch (error) {
            if (
                error instanceof Error &&
                ["Item do pedido nao encontrado", "Pedido nao encontrado"].includes(error.message)
            ) {
                throw error;
            }
            throw new Error("Falha ao remover item do pedido");
        }
    }
}

export { DeleteOrderItemService };
