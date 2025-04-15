import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { ResourceNotFoundError } from "../../../use-cases/@errors/resource-not-found-error"
import { UpdateUserUseCase } from "../../../use-cases/user/update-user-use-case"

export async function update(request: FastifyRequest,reply: FastifyReply) {
    const updateParamsSchema = z.object({
        userId: z.string().uuid()
    })

    const updateBodySchema = z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        photo: z.string().url().optional()
    })

    const { userId } = updateParamsSchema.parse(request.params)
    const { name, email, password, photo } = updateBodySchema.parse(request.body)

    const authenticatedUserId = request.user.sub

    if (authenticatedUserId !== userId) {
        return reply.status(403).send({ message: "Você não tem permissão para atualizar este usuário." });
    }

    try { 
        const prismaUserRepository = new PrismaUsersRepository()
        const updateUserUseCase = new UpdateUserUseCase(prismaUserRepository)

        const user = await updateUserUseCase.execute({
            userId,
            data: { name,
                    email, 
                    password, 
                    photo 
                }
        })

        return reply.status(200).send({ user })

    } catch (err) {
        if (err instanceof ResourceNotFoundError){
            return reply.status(404).send({message: err.message})
        }
        throw err
    }
}