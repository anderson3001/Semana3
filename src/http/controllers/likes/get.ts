import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaLikesRepository } from "../../../repositories/prisma/prisma-likes-repository"
import { GetLikeUseCase } from "../../../use-cases/likes/get-like-use-case"

export async function get(request: FastifyRequest,reply: FastifyReply) {
    const getParamsSchema = z.object({
        likeId: z.string().uuid()
    })

    const { likeId } = getParamsSchema.parse(request.params)

    try {
        const prismaLikeRepository = new PrismaLikesRepository()
        const getLikeUseCase = new GetLikeUseCase(prismaLikeRepository)

        const {like} = await getLikeUseCase.execute({
            likeId    
        })

        return reply.status(200).send(like)

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}