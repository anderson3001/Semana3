import { Like } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { LikesRepository } from "../../repositories/likes-repository"

interface GetLikeUseCaseRequest {
    postId: string
}
interface GetLikeUseCaseResponse {
    like: Like[]
}


export class GetLikeByPostUseCase{

    constructor(private likesRepository: LikesRepository) {}

    async execute({postId}: GetLikeUseCaseRequest): Promise<GetLikeUseCaseResponse>{
        const like = await this.likesRepository.findByPostId(postId)
        
        if (!like) {
            throw new ResourceNotFoundError()
        }

        return { like }
    }
    
    
}