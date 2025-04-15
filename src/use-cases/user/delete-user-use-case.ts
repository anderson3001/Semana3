import { User } from "@prisma/client"
import { UsersRepository } from "../../repositories/users-repostory"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"

interface DeleteUserUseCaseRequest {
    userId: string
}
interface DeleteUserUseCaseResponse {
    user: User
}


export class DeleteUserUseCase{

    constructor(private usersRepository: UsersRepository) {}

    async execute({userId}: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse>{
        const user = await this.usersRepository.delete(userId)
        
        if (!user) {
            throw new ResourceNotFoundError()
        }

        return { user }
    }
    
    
}