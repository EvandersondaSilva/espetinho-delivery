import { Request, Response } from "express";
import { EnableProductService } from "../../services/product/enableProductService";

class EnableProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const productId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const enableProduct = new EnableProductService();

        const product = await enableProduct.execute({
            id: productId,
        });

        res.status(200).json(product);
    }
}

export { EnableProductController };
