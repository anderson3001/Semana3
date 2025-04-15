import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { AuthenticateUseCase } from "../../../use-cases/user/authenticate-use-case"

export async function authenticate(request: FastifyRequest,reply: FastifyReply) {//criando usuario
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const {email, password } = authenticateBodySchema.parse(request.body)

    try {
        const prismaUserRepository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(prismaUserRepository)

        const { user } = await authenticateUseCase.execute({ 
            email, 
            password
        })

        const token = await reply.jwtSign({},{
            sign: {
                sub:user.id
            }
        })
        const refreshToken = await reply.jwtSign({},{
            sign: {
                sub: user.id,
                expiresIn: "7d"
            }
        })

        return reply.status(200)
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
        })
        .send({ token })
    
    } catch (err) {
        return reply.status(401).send()
    }
}
