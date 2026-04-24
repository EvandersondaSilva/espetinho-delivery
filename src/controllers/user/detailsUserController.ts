import { Request, Response } from "express";
import { detailUserService } from "../../services/user/detailsUserService";


class DetailUserController {
    async handle(req: Request, res: Response) {

        const user_id = req.user_id;

        const detailUser = new detailUserService()

        const user = await detailUser.execute(user_id)

        return res.json(user)
    }
}

export { DetailUserController }