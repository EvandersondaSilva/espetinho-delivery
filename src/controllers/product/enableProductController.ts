import { Request, Response } from "express";
import { EnableProductService } from "../../services/product/enableProductService";

class EnableProductController {
    async handle(req: Request, res: Response) {
        const productId = req.params.id as string;

        const enableProduct = new EnableProductService();

        const product = await enableProduct.execute({
            id: productId,
        });

        res.status(200).json(product);
    }
}

export { EnableProductController };
