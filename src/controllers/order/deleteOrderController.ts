import { Request, Response } from "express";
import { DeleteOrderService } from "../../services/order/deleteOrderService";

class DeleteOrderController {
    async handle(req: Request, res: Response) {
        const orderId = req.params.id as string;

        const deleteOrderService = new DeleteOrderService();

        const order = await deleteOrderService.execute({
            id: orderId,
        });

        return res.status(200).json(order);
    }
}

export { DeleteOrderController };
