import { FastifyReply, FastifyRequest } from "fastify"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaPostsRepository } from "../../../repositories/prisma/prisma-posts-repository"
import { GetAllPostsUseCase } from "../../../use-cases/posts/get-all-post-use-case"
import { z } from "zod";
import { GetPostUseCase } from "../../../use-cases/posts/get-post-use-case";

export async function getAll(request: FastifyRequest,reply: FastifyReply) {
    const getAllPostsQuerySchema = z.object({
        page: z.coerce
          .number()
          .int()
          .positive()
          .optional()
          .default(1),
      
        limit: z.coerce
          .number()
          .int()
          .positive()
          .optional()
          .default(10),

        title: z.string().optional(),
        content: z.string().optional(),
        orderBy: z.enum(["LIKES", "COMMENTS", "LATEST"]).optional()
      });
    const query = getAllPostsQuerySchema.parse(request.query);
    
    try {
        const prismaPostRepository = new PrismaPostsRepository()
        const getAllPostUseCase = new GetAllPostsUseCase(prismaPostRepository)

        const allPosts = await getAllPostUseCase.execute(query)

        const responseMetaParams = {
            currentPage: query.page,
            perPage: query.limit
          };
      

        return reply.status(200).send({
            data: allPosts.post,
            meta: responseMetaParams
        }
        )

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}