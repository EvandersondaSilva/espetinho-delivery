import { Request, Response } from "express";
import { CreateComboService } from "../../services/combo/createComboService";

class CreateComboController {
    async handle(req: Request, res: Response) {
        const { name, price, description, groups } = req.body;

        const createCombo = new CreateComboService();

        const combo = await createCombo.execute({
            name,
            price: parseInt(price, 10),
            description,
            groups: JSON.parse(groups),
            imageUrl: req.file?.buffer,
            imageName: req.file?.originalname,
        });

        return res.json(combo);
    }
}

export { CreateComboController };
