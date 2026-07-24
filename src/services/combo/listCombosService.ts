import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { comboSelect } from "../../prisma/selects";
import { formatCombos } from "./formatCombo";

class ListCombosService {
    async execute() {
        try {
            const combos = await prismaClient.combo.findMany({
                orderBy: { createdAt: "desc" },
                select: comboSelect,
            });

            return formatCombos(combos);
        } catch {
            throw new AppError("Falha ao listar combos", 500);
        }
    }
}

export { ListCombosService };
