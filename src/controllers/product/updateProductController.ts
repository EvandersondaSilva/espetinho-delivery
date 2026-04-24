import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/updateProductService";

class UpdateProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { name, price, description, categoryId, removeImage } = req.body;

        const productId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const updateProduct = new UpdateProductService();

        const product = await updateProduct.execute({
            id: productId,
            name,
            price: parseInt(price, 10),
            description,
            categoryId,
            removeImage: removeImage === "true",
            ...(req.file && {
                imageUrl: req.file.buffer,
                imageName: req.file.originalname,
            }),
        });

        res.status(200).json(product);
    }
}

export { UpdateProductController };
