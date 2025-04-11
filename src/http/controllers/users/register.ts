import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { RegisterUseCase } from "../../../use-cases/register-use-cases"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { UserAlreadyExists } from "../../../use-cases/errors/user-already-exists-error"
import nodemailer from "nodemailer"

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

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    let options = {
        from: `"API do Anderson" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Seja bem vindo!',
        text: `Olá ${name}, seu cadastro foi realizado com sucesso!`,
    }
    try {
        await transporter.sendMail(options);
        console.log('Email enviado com sucesso!')
    } catch (err) {
        console.log('Erro ao enviar email:');
    }
 
    return reply.status(201).send("Usuário criado com sucesso!")
}