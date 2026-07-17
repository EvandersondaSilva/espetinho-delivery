import { Request, Response } from "express";
import { GetSettingsService } from "../../services/settings/getSettingsService";

class GetSettingsController {
    async handle(_: Request, res: Response) {
        const getSettings = new GetSettingsService();

        const settings = await getSettings.execute();

        res.status(200).json(settings);
    }
}

export { GetSettingsController };
