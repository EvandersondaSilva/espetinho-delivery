import prismaClient from "../../prisma";

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
            throw new Error("Pedido nao encontrado");
        }

        try {
            const order = await prismaClient.order.update({
                where: { id },
                data: { status },
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
            throw new Error("Falha ao atualizar status do pedido");
        }
    }
}

export { UpdateOrderStatusService };
