import { Response, Request } from 'express'
import { AuthUserService } from '../../services/user/authUserService'

class AuthUserController {
    async handle(req: Request, res: Response) {

        const { email, password } = req.body

        const authUserService = new AuthUserService()

        const session = await authUserService.execute({ email, password })

        res.json(session)
    }
}

export { AuthUserController }