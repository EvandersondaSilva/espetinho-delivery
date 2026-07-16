import { Request, Response } from "express";
import { ListPublicCombosService } from "../../services/combo/listPublicCombosService";

class ListPublicCombosController {
    async handle(_: Request, res: Response) {
        const listPublicCombosService = new ListPublicCombosService();

        const combos = await listPublicCombosService.execute();

        res.status(200).json(combos);
    }
}

export { ListPublicCombosController };
