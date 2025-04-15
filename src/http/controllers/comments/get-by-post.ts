import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { GetCommentByPostUseCase } from "../../../use-cases/comments/get-comment-by-post-use-case"

export async function getByPost(request: FastifyRequest,reply: FastifyReply) {

    const getParamsSchema = z.object({
        postId: z.string().uuid()
    })

    const { postId } = getParamsSchema.parse(request.params)
    try {
        const prismaCommentsRepository = new PrismaCommentsRepository()
        const getCommentByPostUseCase = new GetCommentByPostUseCase(prismaCommentsRepository)

        const {comment} = await getCommentByPostUseCase.execute({
            postId
        })

        return reply.status(200).send(comment)

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}