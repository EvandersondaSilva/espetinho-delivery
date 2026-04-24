import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";
import { Readable } from "node:stream";

interface UpdateProductServiceProps {
    id: string;
    name: string;
    price: number;
    description?: string;
    categoryId: string;
    imageUrl?: Buffer;
    imageName?: string;
    removeImage?: boolean;
}

class UpdateProductService {
    async execute({
        id,
        name,
        price,
        description,
        categoryId,
        imageUrl,
        imageName,
        removeImage,
    }: UpdateProductServiceProps) {
        const productExists = await prismaClient.product.findFirst({
            where: { id },
        });

        if (!productExists) {
            throw new Error("Product does not exist");
        }

        const categoryExists = await prismaClient.category.findFirst({
            where: { id: categoryId },
        });

        if (!categoryExists) {
            throw new Error("Category does not exist");
        }

        let bannerUrl: string | undefined;

        if (imageUrl && imageName) {
            try {
                const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "products",
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
                throw new Error("Error uploading image");
            }
        }

        try {
            const product = await prismaClient.product.update({
                where: { id },
                data: {
                    name,
                    price,
                    description,
                    categoryId,
                    ...(bannerUrl !== undefined && { imageUrl: bannerUrl }),
                    ...(removeImage && { imageUrl: null }),
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    imageUrl: true,
                    available: true,
                    categoryId: true,
                    createdAt: true,
                },
            });

            return product;
        } catch (error) {
            throw new Error("Falha ao editar produto");
        }
    }
}

export { UpdateProductService };
