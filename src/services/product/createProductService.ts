import prismaClient from "../../prisma/index";
import cloudinary from "../../config/cloudinary";
import { Readable } from "node:stream";

interface CreateProductServiceProps {
    name: string;
    price: number;
    description?: string;
    categoryId: string;
    imageUrl?: Buffer;
    imageName?: string;
}

class CreateProductService {
    async execute({ name, price, description, categoryId, imageUrl, imageName }: CreateProductServiceProps) {

        const categoryExists = await prismaClient.category.findFirst({
            where: {
                id: categoryId
            }
        })

        if (!categoryExists) {
            throw new Error("Category does not exist");
        }

        let bannerUrl: string | null = null;

        // só faz upload se tiver imagem
        if (imageUrl && imageName) {
            try {
                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: "products",
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
                throw new Error("Error uploading image");
            }
        }

        const product = await prismaClient.product.create({
            data: {
                name: name,
                price: price,
                description: description,
                imageUrl: bannerUrl, // null se não tiver imagem
                categoryId: categoryId
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                imageUrl: true,
                categoryId: true,
                createdAt: true,
            }
        })

        return product;
    }
}

export { CreateProductService };