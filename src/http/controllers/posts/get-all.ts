import { FastifyReply, FastifyRequest } from "fastify"
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error"
import { PrismaPostsRepository } from "../../../repositories/prisma/prisma-posts-repository"
import { GetAllPostsUseCase } from "../../../use-cases/get-all-post-use-case"

export async function getAll(request: FastifyRequest,reply: FastifyReply) {
    
    try {
        const prismaPostRepository = new PrismaPostsRepository()
        const getAllPostUseCase = new GetAllPostsUseCase(prismaPostRepository)

        const posts = await getAllPostUseCase.execute()

        return reply.status(200).send({ posts })

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}