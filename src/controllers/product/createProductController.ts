import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/createProductService";

class CreateProductController {
    async handle(req: Request, res: Response) {
        const { name, price, description, categoryId } = req.body;



        const createProduct = new CreateProductService();

        const product = await createProduct.execute({
            name,
            price: parseInt(price), // garante que seja número
            description,
            categoryId,
            imageUrl: req.file?.buffer,
            imageName: req.file?.originalname,
        });

        return res.json(product);
    }

}

export { CreateProductController };