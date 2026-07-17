import { Request, Response } from "express";
import { UpdateStoreStatusService } from "../../services/settings/updateStoreStatusService";

class UpdateStoreStatusController {
    async handle(req: Request, res: Response) {
        const { isStoreOpen } = req.body;

        const updateStoreStatus = new UpdateStoreStatusService();

        const settings = await updateStoreStatus.execute({ isStoreOpen });

        res.status(200).json(settings);
    }
}

export { UpdateStoreStatusController };
