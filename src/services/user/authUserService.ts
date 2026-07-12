import { compare } from "bcryptjs";
import prismaClient from "../../prisma";
import { sign } from 'jsonwebtoken'
import { AppError } from "../../errors/AppError"


interface AuthUserRequest {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthUserRequest) {

        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new AppError("Email ou senha inválidos", 401)
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new AppError("Email ou senha inválidos", 401)
        }

        const token = sign({
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET as string, {
            subject: user.id,
            expiresIn: "30d"
        })

        return {
            id: user.id,
            name: user.name,
            role: user.role,
            token: token
        }

    }
}

export { AuthUserService }