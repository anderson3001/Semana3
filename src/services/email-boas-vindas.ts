import nodemailer from "nodemailer"


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