import { Request, Response } from "express";
import { DeleteOrderService } from "../../services/order/deleteOrderService";

class DeleteOrderController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const orderId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const deleteOrderService = new DeleteOrderService();

        const order = await deleteOrderService.execute({
            id: orderId,
        });

        return res.status(200).json(order);
    }
}

export { DeleteOrderController };
