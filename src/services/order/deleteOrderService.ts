import prismaClient from "../../prisma";

interface DeleteOrderRequest {
    id: string;
}

class DeleteOrderService {
    async execute({ id }: DeleteOrderRequest) {
        try {
            const order = await prismaClient.order.delete({
                where: {
                    id,
                },
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
                        select: {
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
                        },
                    },
                },
            });

            return order;
        } catch {
            throw new Error("Falha ao cancelar pedido");
        }
    }
}

export { DeleteOrderService };
