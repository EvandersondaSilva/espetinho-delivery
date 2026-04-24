import prismaClient from "../../prisma";

class ListOrdersService {
    async execute() {
        try {
            const orders = await prismaClient.order.findMany({
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
                orderBy: { createdAt: "desc" },
            });

            return orders;
        } catch {
            throw new Error("Falha ao listar pedidos");
        }
    }
}

export { ListOrdersService };

