import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { DeleteUserUseCase } from "../../../use-cases/user/delete-user-use-case"

export async function deleteUser(request: FastifyRequest,reply: FastifyReply) {
    const getParamsSchema = z.object({
        userId: z.string().uuid()
    })

    const { userId } = getParamsSchema.parse(request.params)

    const authenticatedUserId = request.user.sub

    if (authenticatedUserId !== userId) {
        return reply.status(403).send({ message: "Você não tem permissão para excluir este usuário." });
    }

    try {
        const prismaUserRepository = new PrismaUsersRepository()
        const deleteUserUseCase = new DeleteUserUseCase(prismaUserRepository)

        const user = await deleteUserUseCase.execute({
            userId    
        })

        return reply.status(204).send({ user })

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}