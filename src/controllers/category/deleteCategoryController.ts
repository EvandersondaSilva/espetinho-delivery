import { Request, Response } from "express";
import { DeleteCategoryService } from "../../services/category/deleteCategoryService";

class DeleteCategoryController {
    async handle(req: Request, res: Response) {
        const categoryId = req.params.id as string;

        const deleteCategory = new DeleteCategoryService();

        const category = await deleteCategory.execute({
            id: categoryId
        });

        res.status(200).json(category);
    }
}

export { DeleteCategoryController };
