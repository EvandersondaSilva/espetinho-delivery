import { Request, Response } from "express";
import { UpdateCategoryService } from "../../services/category/updateCategoryService";

class UpdateCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;
        const categoryId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const updateCategory = new UpdateCategoryService();

        const category = await updateCategory.execute({
            id: categoryId,
            name: name
        });

        res.status(200).json(category);
    }
}

export { UpdateCategoryController };
