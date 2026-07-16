import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/updateProductService";

class UpdateProductController {
    async handle(req: Request, res: Response) {
        const productId = req.params.id as string;
        const { name, price, description, categoryId, removeImage, stock } = req.body;

        const updateProduct = new UpdateProductService();

        const product = await updateProduct.execute({
            id: productId,
            name,
            price: parseInt(price, 10),
            description,
            categoryId,
            removeImage: removeImage === "true",
            stock: stock !== undefined && stock !== "" ? parseInt(stock, 10) : undefined,
            ...(req.file && {
                imageUrl: req.file.buffer,
                imageName: req.file.originalname,
            }),
        });

        res.status(200).json(product);
    }
}

export { UpdateProductController };
