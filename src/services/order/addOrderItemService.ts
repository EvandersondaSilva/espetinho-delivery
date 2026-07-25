import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface AddOrderItemRequest {
    orderId: string;
    productId: string;
    quantity: number;
}

class AddOrderItemService {
    async execute({ orderId, productId, quantity }: AddOrderItemRequest) {
        try {
            return await prismaClient.$transaction(async (tx) => {
                const order = await tx.order.findUnique({
                    where: { id: orderId },
                    select: {
                        id: true,
                        status: true,
                        deliveryFee: true,
                        stockDeducted: true,
                        items: {
                            select: { id: true, productId: true, quantity: true },
                        },
                        combos: {
                            select: { price: true },
                        },
                    },
                });

                if (!order) {
                    throw new AppError("Pedido não encontrado", 404);
                }

                if (order.status === "ENTREGUE") {
                    throw new AppError("Pedido já entregue não pode ser editado", 422);
                }

                const product = await tx.product.findUnique({
                    where: { id: productId },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        available: true,
                        stock: true,
                    },
                });

                if (!product) {
                    throw new AppError("Produto não encontrado", 404);
                }

                if (!product.available) {
                    throw new AppError("Produto indisponível", 422);
                }

                // Pedido ja passou por PREPARANDO: o estoque ja foi baixado
                // uma vez, entao adicionar um item aqui precisa baixar tambem,
                // na hora, na quantidade que esta sendo adicionada agora.
                if (order.stockDeducted) {
                    if (product.stock < quantity) {
                        throw new AppError(`Estoque insuficiente para o produto ${product.name}`, 422);
                    }

                    const newStock = product.stock - quantity;

                    await tx.product.update({
                        where: { id: productId },
                        data: {
                            stock: newStock,
                            ...(newStock === 0 && { available: false }),
                        },
                    });
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
                const combosTotal = order.combos.reduce((acc, combo) => acc + combo.price, 0);
                const total = itemsTotal + combosTotal + order.deliveryFee;

                const updated = await tx.order.update({
                    where: { id: orderId },
                    data: { total },
                    select: orderSelect,
                });

                return updated;
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Falha ao adicionar item ao pedido", 500);
        }
    }
}

export { AddOrderItemService };
