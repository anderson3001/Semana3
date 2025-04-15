import nodemailer from "nodemailer"
import { prisma } from "../lib/prisma"
import { Post } from "@prisma/client";

export async function sendEmailWelcome(name: string, email: string) {
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
    
}
export async function newCommentEmail(postId: string) {
    
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: { 
            user: true
        } 
    })
    if (!post || !post.user?.email) {
        throw new Error("Autor do post não encontrado")
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
        text: `Olá, você recebeu um novo comentário no seu post!
        
        http://localhost:3000/post/${postId}`,
    }
    try {
        await transporter.sendMail(options);
        console.log('Email enviado com sucesso!')
    } catch (err) {
        console.log('Erro ao enviar email:');
    }

}export async function weeklyPostSummary(name: string, email: string, posts: Post[]) {
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
        subject: 'Resumo dos posts mais curtidos da semana!',
        text: `Olá ${name}, aqui está o resumo dos posts mais curtidos da semana!\n\n`+
        posts.map(post => `Título: ${post.title}\nConteúdo: ${post.content}\n`).join('\n'),
    }
    try {
        await transporter.sendMail(options);
        console.log('Email enviado com sucesso!')
    } catch (err) {
        console.log('Erro ao enviar email:');
    }
    
}