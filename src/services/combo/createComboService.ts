import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";
import { Readable } from "node:stream";
import { AppError } from "../../errors/AppError";
import { comboSelect } from "../../prisma/selects";
import { validateComboGroups, ComboGroupInput } from "./validateComboGroups";
import { formatCombo } from "./formatCombo";

interface CreateComboServiceProps {
    name: string;
    price: number;
    description?: string;
    groups: ComboGroupInput[];
    imageUrl?: Buffer;
    imageName?: string;
}

class CreateComboService {
    async execute({ name, price, description, groups, imageUrl, imageName }: CreateComboServiceProps) {
        const groupsData = await validateComboGroups(groups);

        let bannerUrl: string | null = null;

        if (imageUrl && imageName) {
            try {
                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: "combos",
                        resource_type: "image",
                        public_id: `${Date.now()}_${imageName.split(".")[0]}`,
                    }, (error, result) => {
                        if (error) reject(error)
                        else resolve(result);
                    })

                    const bufferStream = Readable.from(imageUrl);
                    bufferStream.pipe(uploadStream)
                })

                bannerUrl = result.secure_url;
            } catch (error) {
                console.log("Cloudinary error", error)
                throw new AppError("Falha ao fazer upload da imagem", 500);
            }
        }

        try {
            const combo = await prismaClient.combo.create({
                data: {
                    name,
                    price,
                    description,
                    imageUrl: bannerUrl,
                    groups: {
                        create: groupsData,
                    },
                },
                select: comboSelect,
            });

            return formatCombo(combo);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Falha ao criar combo", 500);
        }
    }
}

export { CreateComboService };
