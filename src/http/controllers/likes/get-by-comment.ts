import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaLikesRepository } from "../../../repositories/prisma/prisma-likes-repository"
import { GetLikeByCommentUseCase } from "../../../use-cases/likes/get-like-by-comment-use-case"

export async function getByComment(request: FastifyRequest,reply: FastifyReply) {

    const getParamsSchema = z.object({
        commentId: z.string().uuid()
    })

    const { commentId } = getParamsSchema.parse(request.params)
    try {
        const prismaLikeRepository = new PrismaLikesRepository()
        const getLikeByCommentUseCase = new GetLikeByCommentUseCase(prismaLikeRepository)

        const {like} = await getLikeByCommentUseCase.execute({
            commentId
        })

        return reply.status(200).send(like)

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}