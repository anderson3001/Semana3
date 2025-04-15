import { Like } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { LikesRepository } from "../../repositories/likes-repository"

interface GetLikeUseCaseRequest {
    userId: string
}
interface GetLikeUseCaseResponse {
    like: Like[]
}


export class GetLikeByUserUseCase{

    constructor(private likesRepository: LikesRepository) {}

    async execute({userId}: GetLikeUseCaseRequest): Promise<GetLikeUseCaseResponse>{
        const like = await this.likesRepository.findByUserId(userId)
        
        if (!like) {
            throw new ResourceNotFoundError()
        }

        return { like }
    }
    
    
}