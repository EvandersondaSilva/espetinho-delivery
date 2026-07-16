import { Request, Response } from "express";
import { GetComboByIdService } from "../../services/combo/getComboByIdService";

class GetComboByIdController {
    async handle(req: Request, res: Response) {
        const comboId = req.params.id as string;

        const getComboById = new GetComboByIdService();

        const combo = await getComboById.execute({ id: comboId });

        res.status(200).json(combo);
    }
}

export { GetComboByIdController };
