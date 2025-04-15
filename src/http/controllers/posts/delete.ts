import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaPostsRepository } from "../../../repositories/prisma/prisma-posts-repository"
import { DeletePostUseCase } from "../../../use-cases/posts/delete-post-use-case"

export async function deletePost(request: FastifyRequest,reply: FastifyReply) {
    const getParamsSchema = z.object({//não muda pois são parametros da url
        postId: z.string().uuid()
    })

    const { postId } = getParamsSchema.parse(request.params)

    const authenticatedUserId = request.user.sub

    try {
        const prismaPostRepository = new PrismaPostsRepository();
        const deletePostUseCase = new DeletePostUseCase(prismaPostRepository);

        const post = await prismaPostRepository.findById(postId);
        if (!post) {
            return reply.status(404).send({ message: "Post não encontrado" });
        }
        if (post.userId !== authenticatedUserId) {
            return reply.status(403).send({ message: "Você não tem permissão para deletar este post." });
        }
        await deletePostUseCase.execute({ postId });


        return reply.status(204).send();

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}