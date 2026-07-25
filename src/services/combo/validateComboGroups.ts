import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

interface ComboGroupFixedItemInput {
    productId: string;
    quantity: number;
}

interface ComboGroupInput {
    type: "CATEGORY_CHOICE" | "FIXED_PRODUCT" | "PRODUCT_CHOICE";
    label: string;
    categoryIds?: string[];
    fixedItems?: ComboGroupFixedItemInput[];
    productIds?: string[];
    minQuantity?: number;
    maxQuantity?: number;
}

interface ComboGroupData {
    type: "CATEGORY_CHOICE" | "FIXED_PRODUCT" | "PRODUCT_CHOICE";
    label: string;
    minQuantity: number;
    maxQuantity: number;
    categories?: { create: { categoryId: string }[] };
    fixedItems?: { create: { productId: string; quantity: number }[] };
    choiceProducts?: { create: { productId: string }[] };
}

function reservedProductIdsOf(group: ComboGroupInput): string[] {
    if (group.type === "FIXED_PRODUCT") {
        return (group.fixedItems ?? []).map((item) => item.productId);
    }
    if (group.type === "PRODUCT_CHOICE") {
        return group.productIds ?? [];
    }
    return [];
}

// Valida existencia de categoria/produto e garante que nenhum group se
// sobreponha:
// - a mesma categoria nao pode ser usada em mais de um group CATEGORY_CHOICE
//   (nem repetida dentro do proprio categoryIds do group);
// - FIXED_PRODUCT (fixedItems) e PRODUCT_CHOICE (productIds) formam um unico
//   pool de "produtos reservados": um produto nao pode se repetir entre/
//   dentro desses groups, nem pertencer a uma categoria ja usada em algum
//   group CATEGORY_CHOICE do combo.
// Isso elimina qualquer ambiguidade na hora de casar as selections do pedido
// com os groups do combo.
async function validateComboGroups(groups: ComboGroupInput[]): Promise<ComboGroupData[]> {
    const categoryIds = [...new Set(
        groups
            .filter((group) => group.type === "CATEGORY_CHOICE")
            .flatMap((group) => group.categoryIds ?? [])
    )];

    const productIds = [...new Set(groups.flatMap(reservedProductIdsOf))];

    const categories = categoryIds.length
        ? await prismaClient.category.findMany({ where: { id: { in: categoryIds } } })
        : [];

    if (categories.length !== categoryIds.length) {
        throw new AppError("Categoria não encontrada", 404);
    }

    const products = productIds.length
        ? await prismaClient.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, categoryId: true },
        })
        : [];

    if (products.length !== productIds.length) {
        throw new AppError("Produto não encontrado", 404);
    }

    const productCategoryMap = new Map(products.map((product) => [product.id, product.categoryId]));

    // Processa os categoryIds de todos os groups CATEGORY_CHOICE em sequencia
    // contra um unico Set: cobre tanto duplicata dentro do proprio group
    // quanto overlap entre groups diferentes, com a mesma checagem.
    const seenCategoryIds = new Set<string>();
    for (const group of groups) {
        if (group.type !== "CATEGORY_CHOICE") continue;

        for (const categoryId of group.categoryIds ?? []) {
            if (seenCategoryIds.has(categoryId)) {
                throw new AppError("Duas groups do combo não podem usar a mesma categoria", 400);
            }

            seenCategoryIds.add(categoryId);
        }
    }

    // Mesma logica acima, agora para o pool unico de produtos reservados
    // (FIXED_PRODUCT + PRODUCT_CHOICE): dedup entre/dentro dos groups e
    // overlap de categoria contra CATEGORY_CHOICE, em uma unica passada.
    const seenReservedProductIds = new Set<string>();
    for (const group of groups) {
        for (const productId of reservedProductIdsOf(group)) {
            if (seenReservedProductIds.has(productId)) {
                throw new AppError("Um produto não pode aparecer em mais de um group FIXED_PRODUCT/PRODUCT_CHOICE do combo", 400);
            }
            seenReservedProductIds.add(productId);

            const productCategoryId = productCategoryMap.get(productId);
            if (productCategoryId && seenCategoryIds.has(productCategoryId)) {
                throw new AppError("Produto pertence a uma categoria já usada em outro group do combo", 400);
            }
        }
    }

    return groups.map((group) => ({
        type: group.type,
        label: group.label,
        minQuantity: group.type !== "FIXED_PRODUCT" ? group.minQuantity! : 1,
        maxQuantity: group.type !== "FIXED_PRODUCT" ? (group.maxQuantity ?? group.minQuantity!) : 1,
        ...(group.type === "CATEGORY_CHOICE" && {
            categories: {
                create: (group.categoryIds ?? []).map((categoryId) => ({ categoryId })),
            },
        }),
        ...(group.type === "FIXED_PRODUCT" && {
            fixedItems: {
                create: (group.fixedItems ?? []).map((item) => ({ productId: item.productId, quantity: item.quantity })),
            },
        }),
        ...(group.type === "PRODUCT_CHOICE" && {
            choiceProducts: {
                create: (group.productIds ?? []).map((productId) => ({ productId })),
            },
        }),
    }));
}

export { validateComboGroups };
export type { ComboGroupInput, ComboGroupData, ComboGroupFixedItemInput };
