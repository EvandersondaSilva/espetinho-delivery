import prismaClient from "../../prisma";

interface GetOrderByIdRequest {
    id: string;
}

class GetOrderByIdService {
    async execute({ id }: GetOrderByIdRequest) {
        try {
            const order = await prismaClient.order.findUnique({
                where: { id },
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

            if (!order) {
                throw new Error("Pedido nao encontrado");
            }

            return order;
        } catch (error) {
            if (error instanceof Error && error.message === "Pedido nao encontrado") {
                throw error;
            }
            throw new Error("Falha ao buscar pedido");
        }
    }
}

export { GetOrderByIdService };
