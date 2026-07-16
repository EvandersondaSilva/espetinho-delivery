import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { comboSelect } from "../../prisma/selects";

interface DeleteComboRequest {
    id: string;
}

class DeleteComboService {
    async execute({ id }: DeleteComboRequest) {
        const comboExists = await prismaClient.combo.findFirst({
            where: { id },
        });

        if (!comboExists) {
            throw new AppError("Combo não encontrado", 404);
        }

        const soldCount = await prismaClient.orderCombo.count({
            where: { comboId: id },
        });

        if (soldCount > 0) {
            throw new AppError("Combo já foi vendido e não pode ser excluído. Desabilite-o em vez disso.", 400);
        }

        try {
            const combo = await prismaClient.combo.delete({
                where: { id },
                select: comboSelect,
            });

            return combo;
        } catch {
            throw new AppError("Falha ao deletar combo", 500);
        }
    }
}

export { DeleteComboService };
