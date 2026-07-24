import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";
import { comboSelect } from "../../prisma/selects";
import { formatCombo } from "./formatCombo";

interface GetComboByIdRequest {
    id: string;
}

class GetComboByIdService {
    async execute({ id }: GetComboByIdRequest) {
        const combo = await prismaClient.combo.findUnique({
            where: { id },
            select: comboSelect,
        });

        if (!combo) {
            throw new AppError("Combo não encontrado", 404);
        }

        return formatCombo(combo);
    }
}

export { GetComboByIdService };
