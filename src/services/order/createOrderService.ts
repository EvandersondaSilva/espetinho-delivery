import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { orderSelect } from "../../prisma/selects";

interface CreateOrderItemRequest {
    productId: string;
    quantity: number;
}

interface CreateOrderComboSelectionRequest {
    productId: string;
    quantity: number;
}

interface CreateOrderComboRequest {
    comboId: string;
    selections: CreateOrderComboSelectionRequest[];
}

interface CreateOrderRequest {
    customerName: string;
    phone: string;
    address: string;
    deliveryFee?: number;
    items?: CreateOrderItemRequest[];
    combos?: CreateOrderComboRequest[];
    paymentMethod: string;
    changeFor?: number;
    noChangeNeeded?: boolean;
}

function mergeSelectionsByProduct(selections: CreateOrderComboSelectionRequest[]) {
    const merged = new Map<string, number>();

    for (const selection of selections) {
        merged.set(selection.productId, (merged.get(selection.productId) ?? 0) + selection.quantity);
    }

    return merged;
}

class CreateOrderService {
    async execute({ customerName, phone, address, deliveryFee = 0, items = [], combos = [], paymentMethod, changeFor, noChangeNeeded }: CreateOrderRequest) {
        try {
            return await prismaClient.$transaction(async (tx) => {
                // --- itens normais ---
                const productIds = items.map((item) => item.productId);
                const uniqueProductIds = [...new Set(productIds)];

                const products = uniqueProductIds.length
                    ? await tx.product.findMany({
                        where: { id: { in: uniqueProductIds } },
                        select: { id: true, name: true, price: true, available: true },
                    })
                    : [];

                if (products.length !== uniqueProductIds.length) {
                    throw new AppError("Um ou mais produtos não existem", 404);
                }

                const productsMap = new Map(products.map((product) => [product.id, product]));

                const unavailableItem = items.find((item) => !productsMap.get(item.productId)?.available);
                if (unavailableItem) {
                    throw new AppError("Pedido contém produto indisponível", 422);
                }

                const orderItemsData = items.map((item) => {
                    const product = productsMap.get(item.productId)!;

                    return {
                        productId: item.productId,
                        quantity: item.quantity,
                        price: product.price,
                    };
                });

                const itemsTotal = orderItemsData.reduce((acc, item) => acc + item.price * item.quantity, 0);

                // --- combos ---
                const comboIds = [...new Set(combos.map((combo) => combo.comboId))];

                const combosFound = comboIds.length
                    ? await tx.combo.findMany({
                        where: { id: { in: comboIds } },
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            available: true,
                            groups: {
                                select: {
                                    type: true,
                                    label: true,
                                    categoryId: true,
                                    productId: true,
                                    minQuantity: true,
                                    maxQuantity: true,
                                },
                            },
                        },
                    })
                    : [];

                if (combosFound.length !== comboIds.length) {
                    throw new AppError("Um ou mais combos não existem", 404);
                }

                const combosMap = new Map(combosFound.map((combo) => [combo.id, combo]));

                const unavailableCombo = combosFound.find((combo) => !combo.available);
                if (unavailableCombo) {
                    throw new AppError(`Combo "${unavailableCombo.name}" indisponível`, 422);
                }

                const selectionProductIds = [
                    ...new Set(combos.flatMap((combo) => combo.selections.map((selection) => selection.productId))),
                ];

                const selectionProducts = selectionProductIds.length
                    ? await tx.product.findMany({
                        where: { id: { in: selectionProductIds } },
                        select: { id: true, available: true, categoryId: true },
                    })
                    : [];

                if (selectionProducts.length !== selectionProductIds.length) {
                    throw new AppError("Um ou mais produtos das selections não existem", 404);
                }

                const selectionProductsMap = new Map(selectionProducts.map((product) => [product.id, product]));

                const unavailableSelectionProduct = selectionProducts.find((product) => !product.available);
                if (unavailableSelectionProduct) {
                    throw new AppError("Seleção contém produto indisponível", 422);
                }

                let combosTotal = 0;
                const orderCombosData = combos.map((comboOrder) => {
                    const combo = combosMap.get(comboOrder.comboId)!;
                    const merged = mergeSelectionsByProduct(comboOrder.selections);
                    const remaining = new Map(merged);

                    for (const group of combo.groups) {
                        if (group.type === "FIXED_PRODUCT") {
                            const quantity = remaining.get(group.productId!);

                            if (quantity === undefined || quantity !== group.minQuantity) {
                                throw new AppError(
                                    `Seleção do combo "${combo.name}" não atende ao grupo obrigatório "${group.label}"`,
                                    400
                                );
                            }

                            remaining.delete(group.productId!);
                        } else {
                            let sum = 0;
                            const matchedProductIds: string[] = [];

                            for (const [productId, quantity] of remaining) {
                                if (selectionProductsMap.get(productId)?.categoryId === group.categoryId) {
                                    sum += quantity;
                                    matchedProductIds.push(productId);
                                }
                            }

                            const max = group.maxQuantity ?? group.minQuantity;
                            if (sum < group.minQuantity || sum > max) {
                                throw new AppError(
                                    `Quantidade selecionada para o grupo "${group.label}" do combo "${combo.name}" deve estar entre ${group.minQuantity} e ${max}`,
                                    400
                                );
                            }

                            for (const productId of matchedProductIds) {
                                remaining.delete(productId);
                            }
                        }
                    }

                    if (remaining.size > 0) {
                        throw new AppError(
                            `Seleção contém produto que não pertence a nenhum grupo do combo "${combo.name}"`,
                            400
                        );
                    }

                    combosTotal += combo.price;

                    return {
                        comboId: combo.id,
                        price: combo.price,
                        items: {
                            create: [...merged.entries()].map(([productId, quantity]) => ({
                                productId,
                                quantity,
                            })),
                        },
                    };
                });

                const orderTotal = itemsTotal + combosTotal + deliveryFee;

                const order = await tx.order.create({
                    data: {
                        customerName,
                        phone,
                        address,
                        deliveryFee,
                        total: orderTotal,
                        paymentMethod,
                        changeFor,
                        noChangeNeeded,
                        items: {
                            create: orderItemsData,
                        },
                        combos: {
                            create: orderCombosData,
                        },
                    },
                    select: orderSelect,
                });

                return order;
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Falha ao criar pedido", 500);
        }
    }
}

export { CreateOrderService };
