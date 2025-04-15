import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { UpdateCommentUseCase } from "../../../use-cases/comments/update-comment-use-case"

export async function update(request: FastifyRequest,reply: FastifyReply) {
    const updateParamsSchema = z.object({
        commentId: z.string().uuid()
    })

    const updateBodySchema = z.object({
        content: z.string()
    })

    const authenticatedUserId = request.user.sub

    const { commentId } = updateParamsSchema.parse(request.params)
    const { content} = updateBodySchema.parse(request.body)

    try { 
        const prismaCommentRepository = new PrismaCommentsRepository()
        const updateCommentUseCase = new UpdateCommentUseCase(prismaCommentRepository)

        const comment = await prismaCommentRepository.findById(commentId);
        if (!comment) {
            return reply.status(404).send({ message: "Comentário não encontrado" });
        }
        if (comment.userId !== authenticatedUserId) {
            return reply.status(403).send({ message: "Você não tem permissão para deletar este comentário." });
        }
        await updateCommentUseCase.execute({
            commentId,
            data: { 
                content
                }
        })

        return reply.status(200).send("Comentário atualizado com sucesso!")

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}