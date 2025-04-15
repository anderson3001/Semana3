import { Like } from "@prisma/client"
import { LikesRepository } from "../../repositories/likes-repository"

interface CreateLikeUseCaseRequest {
    userId: string,
    postId?: string,
    commentId?: string
}
interface CreateLikeUseCaseResponse {
    like: Like
}


export class CreateLikeUseCase{

    constructor(private likesRepository: LikesRepository) {}

    async execute({userId, postId, commentId}: CreateLikeUseCaseRequest): Promise<CreateLikeUseCaseResponse> {
    
        const like = await this.likesRepository.create({
            userId,
            postId,
            commentId
        })

        return { like }
    }
}