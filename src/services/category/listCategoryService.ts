
import prismaClient from "../../prisma";
import { AppError } from "../../errors/AppError";

class ListCategoryService {
    async execute() {
        try {

            const categories = await prismaClient.category.findMany({
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                },
                orderBy: { createdAt: "desc" }
            })

            return categories;


        } catch (error) {
            throw new AppError("Falha ao listar categorias", 500)
        }
    }
}

export { ListCategoryService }