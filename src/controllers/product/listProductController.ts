import { Request, Response } from "express";
import { ListProductService } from "../../services/product/listProductService";

class ListProductController {
    async handle(req: Request, res: Response) {
        const listProductService = new ListProductService();

        const products = await listProductService.execute();

        res.status(200).json(products);
    }
}

export { ListProductController };
