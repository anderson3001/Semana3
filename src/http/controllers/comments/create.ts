import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { CreatePostUseCase } from "../../../use-cases/create-post-use-case"
import { PrismaPostsRepository } from "../../../repositories/prisma/prisma-posts-repository"
import { PrismaLikesRepository } from "../../../repositories/prisma/prisma-likes-repository"
import { CreateLikeUseCase } from "../../../use-cases/create-like-use-case"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { CreateCommentUseCase } from "../../../use-cases/create-comment-use-case"

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