import { FastifyReply, FastifyRequest } from "fastify"
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { GetAllCommentsUseCase } from "../../../use-cases/get-all-comments-use-case"

export async function getAll(request: FastifyRequest,reply: FastifyReply) {
    
    try {
        const prismaCommentRepository = new PrismaCommentsRepository()
        const getAllCommentsUseCase = new GetAllCommentsUseCase(prismaCommentRepository)

        const comments = await getAllCommentsUseCase.execute()

        return reply.status(200).send({ comments })

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}