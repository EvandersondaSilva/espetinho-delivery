import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { settingsSelect } from "../../prisma/selects";
import { getOrCreateSettings } from "./getOrCreateSettings";

interface UpdateMinOrderValueRequest {
    minOrderValue: number;
}

class UpdateMinOrderValueService {
    async execute({ minOrderValue }: UpdateMinOrderValueRequest) {
        const settings = await getOrCreateSettings();

        try {
            const updated = await prismaClient.settings.update({
                where: { id: settings.id },
                data: { minOrderValue },
                select: settingsSelect,
            });

            return updated;
        } catch {
            throw new AppError("Falha ao atualizar valor mínimo do pedido", 500);
        }
    }
}

export { UpdateMinOrderValueService };
