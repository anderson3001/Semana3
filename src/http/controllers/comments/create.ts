import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaCommentsRepository } from "../../../repositories/prisma/prisma-comments-repository"
import { CreateCommentUseCase } from "../../../use-cases/create-comment-use-case"
import { prisma } from "../../../lib/prisma"
import nodemailer from "nodemailer"

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

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: { 
                user: true
            } 
        })
        if (!post || !post.user?.email) {
            return reply.status(404).send({ message: "Autor do post não encontrado" })
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
            to: post.user.email,
            subject: 'Novo comentário!',
            text: `Olá, você recebeu um novo comentário no seu post!`,
        }
        try {
            await transporter.sendMail(options);
            console.log('Email enviado com sucesso!')
        } catch (err) {
            console.log('Erro ao enviar email:');
        }

    } catch (err) {
        throw err
    }

    return reply.status(201).send("Comentário criado com sucesso!")
}