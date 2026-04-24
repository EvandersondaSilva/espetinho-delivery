import { Request, Response } from "express";
import { DisableProductService } from "../../services/product/disableProductService";

class DisableProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const productId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const disableProduct = new DisableProductService();

        const product = await disableProduct.execute({
            id: productId,
        });

        res.status(200).json(product);
    }
}

export { DisableProductController };
