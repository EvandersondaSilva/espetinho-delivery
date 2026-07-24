import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";
import { Readable } from "node:stream";
import { AppError } from "../../errors/AppError";
import { comboSelect } from "../../prisma/selects";
import { validateComboGroups, ComboGroupInput } from "./validateComboGroups";
import { formatCombo } from "./formatCombo";

interface UpdateComboServiceProps {
    id: string;
    name: string;
    price: number;
    description?: string;
    groups: ComboGroupInput[];
    imageUrl?: Buffer;
    imageName?: string;
    removeImage?: boolean;
}

class UpdateComboService {
    async execute({
        id,
        name,
        price,
        description,
        groups,
        imageUrl,
        imageName,
        removeImage,
    }: UpdateComboServiceProps) {
        const comboExists = await prismaClient.combo.findFirst({ where: { id } });

        if (!comboExists) {
            throw new AppError("Combo não encontrado", 404);
        }

        const groupsData = await validateComboGroups(groups);

        let bannerUrl: string | undefined;

        if (imageUrl && imageName) {
            try {
                const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "combos",
                            resource_type: "image",
                            public_id: `${Date.now()}_${imageName.split(".")[0]}`,
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result as { secure_url: string });
                        }
                    );

                    const bufferStream = Readable.from(imageUrl);
                    bufferStream.pipe(uploadStream);
                });

                bannerUrl = result.secure_url;
            } catch (error) {
                console.log("Cloudinary error", error);
                throw new AppError("Falha ao fazer upload da imagem", 500);
            }
        }

        try {
            const combo = await prismaClient.$transaction(async (tx) => {
                await tx.comboGroup.deleteMany({ where: { comboId: id } });

                return tx.combo.update({
                    where: { id },
                    data: {
                        name,
                        price,
                        description,
                        ...(bannerUrl !== undefined && { imageUrl: bannerUrl }),
                        ...(removeImage && { imageUrl: null }),
                        groups: {
                            create: groupsData,
                        },
                    },
                    select: comboSelect,
                });
            });

            return formatCombo(combo);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Falha ao editar combo", 500);
        }
    }
}

export { UpdateComboService };
