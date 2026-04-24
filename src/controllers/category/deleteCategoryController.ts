import { Request, Response } from "express";
import { DeleteCategoryService } from "../../services/category/deleteCategoryService";

class DeleteCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const categoryId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const deleteCategory = new DeleteCategoryService();

        const category = await deleteCategory.execute({
            id: categoryId
        });

        res.status(200).json(category);
    }
}

export { DeleteCategoryController };
