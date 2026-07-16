import { Request, Response } from "express";
import { DeleteComboService } from "../../services/combo/deleteComboService";

class DeleteComboController {
    async handle(req: Request, res: Response) {
        const comboId = req.params.id as string;

        const deleteCombo = new DeleteComboService();

        const combo = await deleteCombo.execute({ id: comboId });

        res.status(200).json(combo);
    }
}

export { DeleteComboController };
