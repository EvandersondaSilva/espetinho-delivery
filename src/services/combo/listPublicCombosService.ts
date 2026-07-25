import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { publicComboSelect } from "../../prisma/selects";

// Achata group.categories (join com combo_group_categories) em duas partes:
// - categories: metadados [{ id, name }]
// - products: lista unica agregando os produtos disponiveis de TODAS as
//   categorias do group (cada produto pertence a exatamente 1 categoria,
//   entao nao ha risco de duplicata na agregacao).
// Achata group.fixedItems (join com combo_group_fixed_items) de
// [{ product: {...}, quantity }] para [{ ...produto, quantity }].
// Para PRODUCT_CHOICE, group.choiceProducts (ja filtrado por available:true
// na query) vira o mesmo campo `products` usado por CATEGORY_CHOICE — o
// join raw nao e reexposto, so a lista final de produtos.
function formatPublicComboGroup(group: {
    type: string;
    categories: { category: { id: string; name: string; products: unknown[] } }[];
    fixedItems: { product: Record<string, unknown>; quantity: number }[];
    choiceProducts: { product: Record<string, unknown> }[];
    [key: string]: unknown;
}) {
    const { categories, fixedItems, choiceProducts, ...rest } = group;

    return {
        ...rest,
        categories: categories.map((entry) => ({
            id: entry.category.id,
            name: entry.category.name,
        })),
        fixedItems: fixedItems.map((entry) => ({ ...entry.product, quantity: entry.quantity })),
        products:
            group.type === "PRODUCT_CHOICE"
                ? choiceProducts.map((entry) => entry.product)
                : categories.flatMap((entry) => entry.category.products),
    };
}

class ListPublicCombosService {
    async execute() {
        try {
            const combos = await prismaClient.combo.findMany({
                where: { available: true },
                orderBy: { createdAt: "desc" },
                select: publicComboSelect,
            });

            return combos.map((combo) => ({
                ...combo,
                groups: combo.groups.map((group) => formatPublicComboGroup(group)),
            }));
        } catch {
            throw new AppError("Falha ao listar combos", 500);
        }
    }
}

export { ListPublicCombosService };
