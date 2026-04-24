import { Request, Response } from "express";
import { ListProductsByCategoryService } from "../../services/product/listProductsByCategoryService";

class ListProductsByCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const categoryId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const listProductsByCategoryService = new ListProductsByCategoryService();

        const products = await listProductsByCategoryService.execute(categoryId);

        res.status(200).json(products);
    }
}

export { ListProductsByCategoryController };
