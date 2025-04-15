import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { RegisterUseCase } from "../../../use-cases/user/register-use-cases"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { UserAlreadyExists } from "../../../use-cases/@errors/user-already-exists-error"


export async function register(request: FastifyRequest,reply: FastifyReply) {//criando usuario
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        photo: z.string().url()
    })

    const { name, email, password, photo } = registerBodySchema.parse(request.body)

    try {
        const prismaUserRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(prismaUserRepository)

        await registerUseCase.execute({
            name, 
            email, 
            password,
            photo
    })

    } catch (err) {
        if (err instanceof UserAlreadyExists){
            return reply.status(409).send({message: err.message})
        }
        throw err
    }

    
    return reply.status(201).send("Usuário criado com sucesso!")
}