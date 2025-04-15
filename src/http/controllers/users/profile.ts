import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { GetUserUseCase } from "../../../use-cases/user/get-user-use-case"

export async function profile(request: FastifyRequest,reply: FastifyReply) {

    const prismaUserRepository = new PrismaUsersRepository()
    const getUserUseCase = new GetUserUseCase(prismaUserRepository)

    const { user } = await getUserUseCase.execute({
        userId: request.user.sub
    })
    return reply.status(200).send({ 
        user: {
            ...user,
            password: undefined
        }
     })
}