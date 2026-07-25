import { Request, Response } from "express";
import { UpdateMinOrderValueService } from "../../services/settings/updateMinOrderValueService";

class UpdateMinOrderValueController {
    async handle(req: Request, res: Response) {
        const { minOrderValue } = req.body;

        const updateMinOrderValue = new UpdateMinOrderValueService();

        const settings = await updateMinOrderValue.execute({ minOrderValue });

        res.status(200).json(settings);
    }
}

export { UpdateMinOrderValueController };
