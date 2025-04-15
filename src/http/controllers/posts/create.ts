import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { CreatePostUseCase } from "../../../use-cases/posts/create-post-use-case"
import { PrismaPostsRepository } from "../../../repositories/prisma/prisma-posts-repository"

export async function create(request: FastifyRequest,reply: FastifyReply) {
    const createBodySchema = z.object({
        title: z.string(),
        content: z.string(),
    })

    const { title, content } = createBodySchema.parse(request.body)

    const userId = request.user.sub

    try {
        const prismaPostsRepository = new PrismaPostsRepository()
        const createPostUseCase = new CreatePostUseCase(prismaPostsRepository)

        await createPostUseCase.execute({
            title,
            content,
            userId
        })

    } catch (err) {
        throw err
    }

    return reply.status(201).send("Post criado com sucesso!")
}