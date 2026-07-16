import { Request, Response } from "express";
import { DisableComboService } from "../../services/combo/disableComboService";

class DisableComboController {
    async handle(req: Request, res: Response) {
        const comboId = req.params.id as string;

        const disableCombo = new DisableComboService();

        const combo = await disableCombo.execute({ id: comboId });

        res.status(200).json(combo);
    }
}

export { DisableComboController };
