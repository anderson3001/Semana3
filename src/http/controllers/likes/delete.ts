import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaLikesRepository } from "../../../repositories/prisma/prisma-likes-repository"
import { DeleteLikeUseCase } from "../../../use-cases/likes/delete-like-use-case"


export async function deleteLike(request: FastifyRequest,reply: FastifyReply) {
    const getParamsSchema = z.object({//não muda pois são parametros da url
        likeId: z.string().uuid()
    })

    const { likeId } = getParamsSchema.parse(request.params)

    const authenticatedUserId = request.user.sub

    try {
        const prismaLikesRepository = new PrismaLikesRepository();
        const deleteLikeUseCase = new DeleteLikeUseCase(prismaLikesRepository);

        const like = await prismaLikesRepository.findById(likeId);
        if (!like) {
            return reply.status(404).send({ message: "Like não encontrado" });
        }
        if (like.userId !== authenticatedUserId) {
            return reply.status(403).send({ message: "Você não tem permissão para deletar este like." });
        }
        await deleteLikeUseCase.execute({ likeId });


        return reply.status(204).send();

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}