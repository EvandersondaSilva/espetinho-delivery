import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/listOrdersService";

class ListOrdersController {
    async handle(req: Request, res: Response) {
        const { page, limit, status } = req.query;

        const listOrdersService = new ListOrdersService();

        const result = await listOrdersService.execute({
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 20,
            status: status as "RECEBIDO" | "PREPARANDO" | "SAIU" | "ENTREGUE" | undefined,
        });

        return res.status(200).json(result);
    }
}

export { ListOrdersController };
