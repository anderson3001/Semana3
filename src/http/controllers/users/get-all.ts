import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error"
import { GetAllUserUseCase } from "../../../use-cases/get-all-user-use-case"

export async function getAll(request: FastifyRequest,reply: FastifyReply) {
    
    try {
        const prismaUserRepository = new PrismaUsersRepository()
        const getAllUserUseCase = new GetAllUserUseCase(prismaUserRepository)

        const users = await getAllUserUseCase.execute()

        return reply.status(200).send({ users })

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}