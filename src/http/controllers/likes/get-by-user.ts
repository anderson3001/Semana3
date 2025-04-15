import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaLikesRepository } from "../../../repositories/prisma/prisma-likes-repository"
import { GetLikeByUserUseCase } from "../../../use-cases/likes/get-like-by-user-use-case"

export async function getByUser(request: FastifyRequest,reply: FastifyReply) {

    const getParamsSchema = z.object({
        userId: z.string().uuid()
    })

    const { userId } = getParamsSchema.parse(request.params)
    try {
        const prismaLikeRepository = new PrismaLikesRepository()
        const getLikeByUserUseCase = new GetLikeByUserUseCase(prismaLikeRepository)

        const {like} = await getLikeByUserUseCase.execute({
            userId
        })

        return reply.status(200).send( like )

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}