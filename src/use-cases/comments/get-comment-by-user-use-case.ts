import { Comment } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { CommentsRepository } from "../../repositories/comments-repostirory"

interface GetCommentUseCaseRequest {
    userId: string
}
interface GetCommentUseCaseResponse {
    comment: Comment[]
}


export class GetCommentByUserUseCase{

    constructor(private commentsRepository: CommentsRepository) {}

    async execute({userId}: GetCommentUseCaseRequest): Promise<GetCommentUseCaseResponse>{
        const comment = await this.commentsRepository.findByUserId(userId)
        
        if (!comment) {
            throw new ResourceNotFoundError()
        }

        return { comment }
    }
    
    
}