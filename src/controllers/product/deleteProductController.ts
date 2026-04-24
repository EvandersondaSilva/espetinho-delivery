import { Request, Response } from "express";
import { DeleteProductService } from "../../services/product/deleteProductService";

class DeleteProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const productId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const deleteProduct = new DeleteProductService();

        const product = await deleteProduct.execute({
            id: productId,
        });

        res.status(200).json(product);
    }
}

export { DeleteProductController };
