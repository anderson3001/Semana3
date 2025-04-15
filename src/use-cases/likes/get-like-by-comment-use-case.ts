import { Like } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { LikesRepository } from "../../repositories/likes-repository"

interface GetLikeUseCaseRequest {
    commentId: string
}
interface GetLikeUseCaseResponse {
    like: Like[]
}


export class GetLikeByCommentUseCase{

    constructor(private likesRepository: LikesRepository) {}

    async execute({commentId}: GetLikeUseCaseRequest): Promise<GetLikeUseCaseResponse>{
        const like = await this.likesRepository.findByCommentId(commentId)
        
        if (!like) {
            throw new ResourceNotFoundError()
        }

        return { like }
    }
    
    
}