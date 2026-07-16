import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface UpdateOrderStatusRequest {
    id: string;
    status: "RECEBIDO" | "PREPARANDO" | "SAIU" | "ENTREGUE";
}

class UpdateOrderStatusService {
    async execute({ id, status }: UpdateOrderStatusRequest) {
        try {
            return await prismaClient.$transaction(async (tx) => {
                const order = await tx.order.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        stockDeducted: true,
                        items: {
                            select: { productId: true, quantity: true },
                        },
                        combos: {
                            select: {
                                items: {
                                    select: { productId: true, quantity: true },
                                },
                            },
                        },
                    },
                });

                if (!order) {
                    throw new AppError("Pedido não encontrado", 404);
                }

                // Baixa o estoque apenas quando o pedido entra em PREPARANDO
                // pela primeira vez na vida (flag stockDeducted garante unicidade).
                if (status === "PREPARANDO" && !order.stockDeducted) {
                    // Agrega a quantidade por produto (mesmo produto pode aparecer
                    // em mais de um item), para validar contra o estoque real.
                    const quantityByProduct = new Map<string, number>();
                    const allItems = [
                        ...order.items,
                        ...order.combos.flatMap((combo) => combo.items),
                    ];
                    for (const item of allItems) {
                        quantityByProduct.set(
                            item.productId,
                            (quantityByProduct.get(item.productId) ?? 0) + item.quantity
                        );
                    }

                    const productIds = [...quantityByProduct.keys()];

                    const products = await tx.product.findMany({
                        where: { id: { in: productIds } },
                        select: { id: true, name: true, stock: true },
                    });

                    const productsMap = new Map(products.map((product) => [product.id, product]));

                    // Valida tudo ANTES de escrever: se qualquer produto nao tiver
                    // estoque suficiente, a transacao inteira e abortada.
                    for (const [productId, quantity] of quantityByProduct) {
                        const product = productsMap.get(productId);

                        if (!product) {
                            throw new AppError("Um ou mais produtos não existem", 404);
                        }

                        if (product.stock < quantity) {
                            throw new AppError(`Estoque insuficiente para o produto ${product.name}`, 422);
                        }
                    }

                    // Baixa o estoque e desabilita o produto quando zera.
                    for (const [productId, quantity] of quantityByProduct) {
                        const product = productsMap.get(productId)!;
                        const newStock = product.stock - quantity;

                        await tx.product.update({
                            where: { id: productId },
                            data: {
                                stock: newStock,
                                ...(newStock === 0 && { available: false }),
                            },
                        });
                    }
                }

                const updated = await tx.order.update({
                    where: { id },
                    data: {
                        status,
                        ...(status === "PREPARANDO" && !order.stockDeducted && { stockDeducted: true }),
                    },
                    select: orderSelect,
                });

                return updated;
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Falha ao atualizar status do pedido", 500);
        }
    }
}

export { UpdateOrderStatusService };
