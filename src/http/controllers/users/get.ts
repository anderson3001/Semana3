import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { GetUserUseCase } from "../../../use-cases/user/get-user-use-case"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"

export async function get(request: FastifyRequest,reply: FastifyReply) {
    const getParamsSchema = z.object({
        userId: z.string().uuid()
    })

    const { userId } = getParamsSchema.parse(request.params)

    try {
        const prismaUserRepository = new PrismaUsersRepository()
        const getUserUseCase = new GetUserUseCase(prismaUserRepository)

        const {user} = await getUserUseCase.execute({
            userId    
        })

        return reply.status(200).send(user)

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}