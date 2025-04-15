import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { CreateCommentUseCase } from "../../../use-cases/comments/create-comment-use-case"
import { prisma } from "../../../lib/prisma"

export async function create(request: FastifyRequest,reply: FastifyReply) {
    const createBodySchema = z.object({
        content: z.string(),
        postId: z.string().uuid(),
    })

    const { content, postId } = createBodySchema.parse(request.body)

    const userId = request.user.sub

    try {
        const prismaCommentsRepository = new PrismaCommentsRepository()
        const createCommentUseCase = new CreateCommentUseCase(prismaCommentsRepository)

        await createCommentUseCase.execute({
            content,
            userId,
            postId
        })

        
    } catch (err) {
        throw err
    }

    return reply.status(201).send("Comentário criado com sucesso!")
}