import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { GetCommentUseCase } from "../../../use-cases/comments/get-comment-use-case"

export async function get(request: FastifyRequest,reply: FastifyReply) {
    const getParamsSchema = z.object({
        commentId: z.string().uuid()
    })

    const { commentId } = getParamsSchema.parse(request.params)

    try {
        const prismaCommentsRepository = new PrismaCommentsRepository()
        const getCommentUseCase = new GetCommentUseCase(prismaCommentsRepository)

        const {comment} = await getCommentUseCase.execute({
            commentId    
        })

        return reply.status(200).send( comment )

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}