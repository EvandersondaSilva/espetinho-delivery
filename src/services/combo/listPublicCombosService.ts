import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { publicComboSelect } from "../../prisma/selects";

class ListPublicCombosService {
    async execute() {
        try {
            const combos = await prismaClient.combo.findMany({
                where: { available: true },
                orderBy: { createdAt: "desc" },
                select: publicComboSelect,
            });

            return combos;
        } catch {
            throw new AppError("Falha ao listar combos", 500);
        }
    }
}

export { ListPublicCombosService };
