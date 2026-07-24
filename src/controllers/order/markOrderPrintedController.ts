import { Request, Response } from "express";
import { MarkOrderPrintedService } from "../../services/order/markOrderPrintedService";

class MarkOrderPrintedController {
    async handle(req: Request, res: Response) {
        const orderId = req.params.id as string;

        const markOrderPrinted = new MarkOrderPrintedService();

        const order = await markOrderPrinted.execute({ id: orderId });

        return res.status(200).json(order);
    }
}

export { MarkOrderPrintedController };
