import { Request, Response } from "express";
import { ListCombosService } from "../../services/combo/listCombosService";

class ListCombosController {
    async handle(_: Request, res: Response) {
        const listCombosService = new ListCombosService();

        const combos = await listCombosService.execute();

        res.status(200).json(combos);
    }
}

export { ListCombosController };
