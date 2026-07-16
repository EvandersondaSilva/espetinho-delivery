import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { comboSelect } from "../../prisma/selects";

interface EnableComboRequest {
    id: string;
}

class EnableComboService {
    async execute({ id }: EnableComboRequest) {
        const comboExists = await prismaClient.combo.findFirst({
            where: { id },
        });

        if (!comboExists) {
            throw new AppError("Combo não encontrado", 404);
        }

        try {
            const combo = await prismaClient.combo.update({
                where: { id },
                data: { available: true },
                select: comboSelect,
            });

            return combo;
        } catch {
            throw new AppError("Falha ao habilitar combo", 500);
        }
    }
}

export { EnableComboService };
