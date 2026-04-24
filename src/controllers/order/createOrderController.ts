import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/createOrderService";

class CreateOrderController {
    async handle(req: Request, res: Response) {
        const { customerName, phone, address, deliveryFee, items } = req.body;

        const createOrder = new CreateOrderService();

        const order = await createOrder.execute({
            customerName,
            phone,
            address,
            deliveryFee,
            items,
        });

        return res.status(201).json(order);
    }
}

export { CreateOrderController };
