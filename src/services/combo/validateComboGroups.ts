import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

interface ComboGroupFixedItemInput {
    productId: string;
    quantity: number;
}

interface ComboGroupInput {
    type: "CATEGORY_CHOICE" | "FIXED_PRODUCT";
    label: string;
    categoryIds?: string[];
    fixedItems?: ComboGroupFixedItemInput[];
    minQuantity?: number;
    maxQuantity?: number;
}

interface ComboGroupData {
    type: "CATEGORY_CHOICE" | "FIXED_PRODUCT";
    label: string;
    minQuantity: number;
    maxQuantity: number;
    categories?: { create: { categoryId: string }[] };
    fixedItems?: { create: { productId: string; quantity: number }[] };
}

// Valida existencia de categoria/produto e garante que nenhum group se
// sobreponha (uma mesma categoria usada em mais de um group CATEGORY_CHOICE,
// mesmo que dentro do proprio array categoryIds do group, ou um produto fixo
// cuja categoria ja e usada por algum group CATEGORY_CHOICE do mesmo combo).
// Isso elimina qualquer ambiguidade na hora de casar as selections do pedido
// com os groups do combo.
async function validateComboGroups(groups: ComboGroupInput[]): Promise<ComboGroupData[]> {
    const categoryIds = [...new Set(
        groups
            .filter((group) => group.type === "CATEGORY_CHOICE")
            .flatMap((group) => group.categoryIds ?? [])
    )];

    const productIds = [...new Set(
        groups
            .filter((group) => group.type === "FIXED_PRODUCT")
            .flatMap((group) => (group.fixedItems ?? []).map((item) => item.productId))
    )];

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

    for (const group of groups) {
        if (group.type !== "FIXED_PRODUCT") continue;

        for (const item of group.fixedItems ?? []) {
            const productCategoryId = productCategoryMap.get(item.productId);
            if (productCategoryId && seenCategoryIds.has(productCategoryId)) {
                throw new AppError("Produto fixo pertence a uma categoria já usada em outro group do combo", 400);
            }
        }
    }

    return groups.map((group) => ({
        type: group.type,
        label: group.label,
        minQuantity: group.type === "CATEGORY_CHOICE" ? group.minQuantity! : 1,
        maxQuantity: group.type === "CATEGORY_CHOICE" ? (group.maxQuantity ?? group.minQuantity!) : 1,
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
    }));
}

export { validateComboGroups };
export type { ComboGroupInput, ComboGroupData, ComboGroupFixedItemInput };
