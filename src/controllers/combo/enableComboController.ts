import { Request, Response } from "express";
import { EnableComboService } from "../../services/combo/enableComboService";

class EnableComboController {
    async handle(req: Request, res: Response) {
        const comboId = req.params.id as string;

        const enableCombo = new EnableComboService();

        const combo = await enableCombo.execute({ id: comboId });

        res.status(200).json(combo);
    }
}

export { EnableComboController };
