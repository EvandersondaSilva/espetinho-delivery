import { Request, Response } from "express";
import { UpdateComboService } from "../../services/combo/updateComboService";

class UpdateComboController {
    async handle(req: Request, res: Response) {
        const comboId = req.params.id as string;
        const { name, price, description, groups, removeImage } = req.body;

        const updateCombo = new UpdateComboService();

        const combo = await updateCombo.execute({
            id: comboId,
            name,
            price: parseInt(price, 10),
            description,
            groups: JSON.parse(groups),
            removeImage: removeImage === "true",
            ...(req.file && {
                imageUrl: req.file.buffer,
                imageName: req.file.originalname,
            }),
        });

        res.status(200).json(combo);
    }
}

export { UpdateComboController };
