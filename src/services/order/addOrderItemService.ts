import prismaClient from "../../prisma";

interface AddOrderItemRequest {
    orderId: string;
    productId: string;
    quantity: number;
}

export const orderItemSelect = {
    id: true,
    productId: true,
    quantity: true,
    price: true,
    product: {
        select: {
            id: true,
            name: true,
            imageUrl: true,
        },
    },
} as const;

class AddOrderItemService {
    async execute({ orderId, productId, quantity }: AddOrderItemRequest) {
        try {
            return await prismaClient.$transaction(async (tx) => {
                const order = await tx.order.findUnique({
                    where: { id: orderId },
                    select: {
                        id: true,
                        deliveryFee: true,
                        items: {
                            select: { id: true, productId: true, quantity: true },
                        },
                    },
                });

                if (!order) {
                    throw new Error("Pedido nao encontrado");
                }

                const product = await tx.product.findUnique({
                    where: { id: productId },
                    select: {
                        id: true,
                        price: true,
                        available: true,
                    },
                });

                if (!product) {
                    throw new Error("Produto nao existe");
                }

                if (!product.available) {
                    throw new Error("Produto indisponivel");
                }

                const existing = order.items.find((item) => item.productId === productId);

                if (existing) {
                    await tx.orderItem.update({
                        where: { id: existing.id },
                        data: { quantity: existing.quantity + quantity },
                    });
                } else {
                    await tx.orderItem.create({
                        data: {
                            orderId,
                            productId,
                            quantity,
                            price: product.price,
                        },
                    });
                }

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
                ["Pedido nao encontrado", "Produto nao existe", "Produto indisponivel"].includes(error.message)
            ) {
                throw error;
            }
            throw new Error("Falha ao adicionar item ao pedido");
        }
    }
}

export { AddOrderItemService };
