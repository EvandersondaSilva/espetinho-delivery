import { Request, Response } from "express";
import { UpdateOrderStatusService } from "../../services/order/updateOrderStatusService";

class UpdateOrderStatusController {
    async handle(req: Request, res: Response) {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const { status } = req.body;

        if (!id) {
            throw new Error("Id do pedido e obrigatorio");
        }

        const updateOrderStatusService = new UpdateOrderStatusService();

        const order = await updateOrderStatusService.execute({
            id,
            status,
        });

        return res.status(200).json(order);
    }
}

export { UpdateOrderStatusController };
