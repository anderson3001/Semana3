import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaLikesRepository } from "../../../repositories/prisma/prisma-likes-repository"
import { GetLikeByPostUseCase } from "../../../use-cases/likes/get-like-by-post-use-case"

export async function getByPost(request: FastifyRequest,reply: FastifyReply) {

    const getParamsSchema = z.object({
        postId: z.string().uuid()
    })

    const { postId } = getParamsSchema.parse(request.params)
    try {
        const prismaLikeRepository = new PrismaLikesRepository()
        const getLikeByPostUseCase = new GetLikeByPostUseCase(prismaLikeRepository)

        const {like} = await getLikeByPostUseCase.execute({
            postId
        })

        return reply.status(200).send(like)

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}