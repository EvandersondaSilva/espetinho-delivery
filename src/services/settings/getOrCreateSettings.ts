import prismaClient from "../../prisma";
import { settingsSelect } from "../../prisma/selects";

// Settings e uma config global do estabelecimento: deve existir sempre
// exatamente 1 registro. Esse helper garante isso em qualquer ponto de
// leitura/escrita, sem depender de um seed ter rodado antes.
async function getOrCreateSettings() {
    const settings = await prismaClient.settings.findFirst({
        select: settingsSelect,
    });

    if (settings) {
        return settings;
    }

    return prismaClient.settings.create({
        data: { isStoreOpen: true },
        select: settingsSelect,
    });
}

export { getOrCreateSettings };
