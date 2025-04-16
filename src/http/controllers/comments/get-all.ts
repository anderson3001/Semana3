import { FastifyReply, FastifyRequest } from "fastify"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { GetAllCommentsUseCase } from "../../../use-cases/comments/get-all-comments-use-case"
import { z } from "zod";

export async function getAll(request: FastifyRequest,reply: FastifyReply) {
    const getAllCommentsQuerySchema = z.object({
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
          });
          const query = getAllCommentsQuerySchema.parse(request.query);
    
    try {
        const prismaCommentRepository = new PrismaCommentsRepository()
        const getAllCommentsUseCase = new GetAllCommentsUseCase(prismaCommentRepository)

        const allComments = await getAllCommentsUseCase.execute(query)

        const responseMetaParams = {
            currentPage: query.page,
            perPage: query.limit
          };

        return reply.status(200).send({
            data: allComments.comment,
            meta: responseMetaParams
        })

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}