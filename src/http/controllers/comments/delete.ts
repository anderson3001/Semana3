import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { DeleteCommentUseCase } from "../../../use-cases/comments/delete-comment-use-case"

export async function deleteComment(request: FastifyRequest,reply: FastifyReply) {
    const getParamsSchema = z.object({//não muda pois são parametros da url
        commentId: z.string().uuid()
    })

    const { commentId } = getParamsSchema.parse(request.params)

    const authenticatedUserId = request.user.sub

    try {
        const prismaCommentsRepository = new PrismaCommentsRepository();
        const deleteCommentUseCase = new DeleteCommentUseCase(prismaCommentsRepository);

        const comment = await prismaCommentsRepository.findById(commentId);
        if (!comment) {
            return reply.status(404).send({ message: "Comentário não encontrado" });
        }
        if (comment.userId !== authenticatedUserId) {
            return reply.status(403).send({ message: "Você não tem permissão para deletar este comentário." });
        }
        await deleteCommentUseCase.execute({ commentId });


        return reply.status(204).send();

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}