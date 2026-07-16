import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { comboSelect } from "../../prisma/selects";

interface DisableComboRequest {
    id: string;
}

class DisableComboService {
    async execute({ id }: DisableComboRequest) {
        const comboExists = await prismaClient.combo.findFirst({
            where: { id },
        });

        if (!comboExists) {
            throw new AppError("Combo não encontrado", 404);
        }

        try {
            const combo = await prismaClient.combo.update({
                where: { id },
                data: { available: false },
                select: comboSelect,
            });

            return combo;
        } catch {
            throw new AppError("Falha ao desabilitar combo", 500);
        }
    }
}

export { DisableComboService };
