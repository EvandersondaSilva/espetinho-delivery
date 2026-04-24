import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/listOrdersService";

class ListOrdersController {
    async handle(req: Request, res: Response) {
        // Mantém a assinatura padrão de controllers, mas evita warning de parâmetro não utilizado.
        void req;

        const listOrdersService = new ListOrdersService();

        const orders = await listOrdersService.execute();

        return res.status(200).json(orders);
    }
}

export { ListOrdersController };

