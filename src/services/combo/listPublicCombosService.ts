import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { publicComboSelect } from "../../prisma/selects";

// Achata group.categories (join com combo_group_categories) em duas partes:
// - categories: metadados [{ id, name }]
// - products: lista unica agregando os produtos disponiveis de TODAS as
//   categorias do group (cada produto pertence a exatamente 1 categoria,
//   entao nao ha risco de duplicata na agregacao).
function formatPublicComboGroup(group: {
    categories: { category: { id: string; name: string; products: unknown[] } }[];
    [key: string]: unknown;
}) {
    return {
        ...group,
        categories: group.categories.map((entry) => ({
            id: entry.category.id,
            name: entry.category.name,
        })),
        products: group.categories.flatMap((entry) => entry.category.products),
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
