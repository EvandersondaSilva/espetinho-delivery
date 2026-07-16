import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { comboSelect } from "../../prisma/selects";

class ListCombosService {
    async execute() {
        try {
            const combos = await prismaClient.combo.findMany({
                orderBy: { createdAt: "desc" },
                select: comboSelect,
            });

            return combos;
        } catch {
            throw new AppError("Falha ao listar combos", 500);
        }
    }
}

export { ListCombosService };
