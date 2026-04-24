import { Request, Response } from "express";
import { AddOrderItemService } from "../../services/order/addOrderItemService";

class AddOrderItemController {
    async handle(req: Request, res: Response) {
        const { orderId, productId, quantity } = req.body;

        const addOrderItemService = new AddOrderItemService();

        const order = await addOrderItemService.execute({
            orderId,
            productId,
            quantity,
        });

        return res.status(201).json(order);
    }
}

export { AddOrderItemController };
