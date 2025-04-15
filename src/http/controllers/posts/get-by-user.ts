import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaPostsRepository } from "../../../repositories/prisma/prisma-posts-repository"
import { GetPostByUserUseCase } from "../../../use-cases/posts/get-post-by-user-use-case"

export async function getByUser(request: FastifyRequest,reply: FastifyReply) {

    const getParamsSchema = z.object({
        userId: z.string().uuid()
    })

    const { userId } = getParamsSchema.parse(request.params)
    try {
        const prismaPostRepository = new PrismaPostsRepository()
        const getPostByUserUseCase = new GetPostByUserUseCase(prismaPostRepository)

        const {post} = await getPostByUserUseCase.execute({
            userId
        })

        return reply.status(200).send( post )

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}