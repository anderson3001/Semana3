import { User } from "@prisma/client"
import { UsersRepository, UserUpdateInput } from "../../repositories/users-repostory"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { compare, hash } from "bcryptjs"

interface UpdateUserUseCaseRequest {
    userId: string,
    data: UserUpdateInput
}
interface UpdateUserUseCaseResponse {
    user: User
}


export class UpdateUserUseCase{

    constructor(private usersRepository: UsersRepository) {}

    async execute({userId, data}: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse>{
        const user = await this.usersRepository.findById(userId)
        
        if (!user) {
            throw new ResourceNotFoundError()
        }

        if (data.password) {
            const isSamePassword = await compare(data.password, user.password)
            if (isSamePassword) {
                throw new Error('As senhas devem ser diferentes!')
            }
            data.password = await hash(data.password, 6)
        }
        const userUpdated = await this.usersRepository.update(userId, data)
        if (!userUpdated) {
            throw new ResourceNotFoundError()
        }

        return { user: userUpdated }
    }
    
    
}