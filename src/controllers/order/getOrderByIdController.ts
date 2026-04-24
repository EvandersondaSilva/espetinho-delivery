import { Request, Response } from "express";
import { GetOrderByIdService } from "../../services/order/getOrderByIdService";

class GetOrderByIdController {
    async handle(req: Request, res: Response) {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;

        if (!id) {
            throw new Error("Id do pedido e obrigatorio");
        }

        const getOrderByIdService = new GetOrderByIdService();

        const order = await getOrderByIdService.execute({ id });

        return res.status(200).json(order);
    }
}

export { GetOrderByIdController };
