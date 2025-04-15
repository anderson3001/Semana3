import { Like, Post } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { LikesRepository } from "../../repositories/likes-repository"

interface GetLikeUseCaseRequest {
    likeId: string
}
interface GetLikeUseCaseResponse {
    like: Like
}


export class GetLikeUseCase{

    constructor(private likesRepository: LikesRepository) {}

    async execute({likeId}: GetLikeUseCaseRequest): Promise<GetLikeUseCaseResponse>{
        const like = await this.likesRepository.findById(likeId)
        
        if (!like) {
            throw new ResourceNotFoundError()
        }

        return { like }
    }
    
    
}