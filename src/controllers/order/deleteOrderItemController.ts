import { Request, Response } from "express";
import { DeleteOrderItemService } from "../../services/order/deleteOrderItemService";

class DeleteOrderItemController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const orderItemId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

        const deleteOrderItemService = new DeleteOrderItemService();

        const order = await deleteOrderItemService.execute({
            id: orderItemId,
        });

        return res.status(200).json(order);
    }
}

export { DeleteOrderItemController };
