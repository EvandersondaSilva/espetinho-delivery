import { Request, Response } from "express";
import { DeleteProductService } from "../../services/product/deleteProductService";

class DeleteProductController {
    async handle(req: Request, res: Response) {
        const productId = req.params.id as string;

        const deleteProduct = new DeleteProductService();

        const product = await deleteProduct.execute({
            id: productId,
        });

        res.status(200).json(product);
    }
}

export { DeleteProductController };
