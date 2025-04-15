import { hash } from "bcryptjs"
import { UsersRepository } from "../../repositories/users-repostory"
import { UserAlreadyExists } from "../@errors/user-already-exists-error"
import { sendEmailWelcome } from "../../services/email"

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string   
    photo: string
}

export class RegisterUseCase{

    constructor(private usersRepository: UsersRepository) {}

    async execute({name, email, password, photo}: RegisterUseCaseRequest){
        const userWithSameEmail = await this.usersRepository.findByEmail(email)
    
        if (userWithSameEmail) {
            throw new UserAlreadyExists()
        }
    
        const passwordHash = await hash(password, 6)
    
        await this.usersRepository.create({
            name,
            email,
            password: passwordHash,
            photo
        })
        await sendEmailWelcome(name, email)
    }

    
    
}