import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

interface ComboGroupInput {
    type: "CATEGORY_CHOICE" | "FIXED_PRODUCT";
    label: string;
    categoryId?: string;
    productId?: string;
    minQuantity: number;
    maxQuantity?: number;
}

interface ComboGroupData {
    type: "CATEGORY_CHOICE" | "FIXED_PRODUCT";
    label: string;
    categoryId: string | null;
    productId: string | null;
    minQuantity: number;
    maxQuantity: number;
}

// Valida existencia de categoria/produto e garante que nenhum group se
// sobreponha (mesma categoria usada 2x, ou produto fixo cuja categoria
// ja e usada por um group CATEGORY_CHOICE do mesmo combo). Isso elimina
// qualquer ambiguidade na hora de casar as selections do pedido com os
// groups do combo.
async function validateComboGroups(groups: ComboGroupInput[]): Promise<ComboGroupData[]> {
    const categoryIds = [...new Set(
        groups.filter((group) => group.type === "CATEGORY_CHOICE").map((group) => group.categoryId!)
    )];

    const productIds = [...new Set(
        groups.filter((group) => group.type === "FIXED_PRODUCT").map((group) => group.productId!)
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

    const seenCategoryIds = new Set<string>();
    for (const group of groups) {
        if (group.type !== "CATEGORY_CHOICE") continue;

        if (seenCategoryIds.has(group.categoryId!)) {
            throw new AppError("Duas groups do combo não podem usar a mesma categoria", 400);
        }

        seenCategoryIds.add(group.categoryId!);
    }

    for (const group of groups) {
        if (group.type !== "FIXED_PRODUCT") continue;

        const productCategoryId = productCategoryMap.get(group.productId!);
        if (productCategoryId && seenCategoryIds.has(productCategoryId)) {
            throw new AppError("Produto fixo pertence a uma categoria já usada em outro group do combo", 400);
        }
    }

    return groups.map((group) => ({
        type: group.type,
        label: group.label,
        categoryId: group.type === "CATEGORY_CHOICE" ? group.categoryId! : null,
        productId: group.type === "FIXED_PRODUCT" ? group.productId! : null,
        minQuantity: group.minQuantity,
        maxQuantity: group.maxQuantity ?? group.minQuantity,
    }));
}

export { validateComboGroups };
export type { ComboGroupInput, ComboGroupData };
