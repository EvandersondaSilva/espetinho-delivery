import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { settingsSelect } from "../../prisma/selects";
import { getOrCreateSettings } from "./getOrCreateSettings";

interface UpdateStoreStatusRequest {
    isStoreOpen: boolean;
}

class UpdateStoreStatusService {
    async execute({ isStoreOpen }: UpdateStoreStatusRequest) {
        const settings = await getOrCreateSettings();

        try {
            const updated = await prismaClient.settings.update({
                where: { id: settings.id },
                data: { isStoreOpen },
                select: settingsSelect,
            });

            return updated;
        } catch {
            throw new AppError("Falha ao atualizar status da loja", 500);
        }
    }
}

export { UpdateStoreStatusService };
