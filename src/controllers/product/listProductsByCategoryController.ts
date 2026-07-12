import { Request, Response } from "express";
import { ListProductsByCategoryService } from "../../services/product/listProductsByCategoryService";

class ListProductsByCategoryController {
    async handle(req: Request, res: Response) {
        const categoryId = req.params.id as string;

        const listProductsByCategoryService = new ListProductsByCategoryService();

        const products = await listProductsByCategoryService.execute(categoryId);

        res.status(200).json(products);
    }
}

export { ListProductsByCategoryController };
