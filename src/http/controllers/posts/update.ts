import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaPostsRepository } from "../../../repositories/prisma/prisma-posts-repository"
import { UpdatePostUseCase } from "../../../use-cases/posts/update-post-use-case"

export async function update(request: FastifyRequest,reply: FastifyReply) {
    const updateParamsSchema = z.object({
        postId: z.string().uuid()
    })

    const updateBodySchema = z.object({
        title: z.string().optional(),
        content: z.string().optional()
    })

    const authenticatedUserId = request.user.sub

    const { postId } = updateParamsSchema.parse(request.params)
    const { title, content} = updateBodySchema.parse(request.body)

    try { 
        const prismaPostRepository = new PrismaPostsRepository()
        const updatePostUseCase = new UpdatePostUseCase(prismaPostRepository)

        const post = await prismaPostRepository.findById(postId);
        if (!post) {
            return reply.status(404).send({ message: "Post não encontrado" });
        }
        if (post.userId !== authenticatedUserId) {
            return reply.status(403).send({ message: "Você não tem permissão para deletar este post." });
        }
        await updatePostUseCase.execute({
            postId,
            data: { 
                title,
                content
                }
        })

        return reply.status(200).send("Post atualizado com sucesso!")

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}