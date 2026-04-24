import prismaClient from "../../prisma";

interface CreateOrderItemRequest {
    productId: string;
    quantity: number;
}

interface CreateOrderRequest {
    customerName: string;
    phone: string;
    address: string;
    deliveryFee?: number;
    items: CreateOrderItemRequest[];
}

class CreateOrderService {
    async execute({ customerName, phone, address, deliveryFee = 0, items }: CreateOrderRequest) {
        const productIds = items.map((item) => item.productId);
        const uniqueProductIds = [...new Set(productIds)];

        const products = await prismaClient.product.findMany({
            where: {
                id: { in: uniqueProductIds },
            },
            select: {
                id: true,
                name: true,
                price: true,
                available: true,
            },
        });

        if (products.length !== uniqueProductIds.length) {
            throw new Error("Um ou mais produtos nao existem");
        }

        const productsMap = new Map(products.map((product) => [product.id, product]));

        const unavailableItem = items.find((item) => !productsMap.get(item.productId)?.available);
        if (unavailableItem) {
            throw new Error("Pedido contem produto indisponivel");
        }

        const orderItemsData = items.map((item) => {
            const product = productsMap.get(item.productId);
            if (!product) {
                throw new Error("Um ou mais produtos nao existem");
            }

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });

        const itemsTotal = orderItemsData.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const orderTotal = itemsTotal + deliveryFee;

        try {
            const order = await prismaClient.order.create({
                data: {
                    customerName,
                    phone,
                    address,
                    deliveryFee,
                    total: orderTotal,
                    items: {
                        create: orderItemsData,
                    },
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
            throw new Error("Falha ao criar pedido");
        }
    }
}

export { CreateOrderService };
