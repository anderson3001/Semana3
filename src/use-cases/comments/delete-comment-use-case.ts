import { Comment } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { CommentsRepository } from "../../repositories/comments-repostirory"

interface DeleteCommentUseCaseRequest {
    commentId: string
}
interface DeleteCommentUseCaseResponse {
    comment: Comment
}


export class DeleteCommentUseCase{

    constructor(private commentsRepository: CommentsRepository) {}

    async execute({commentId}: DeleteCommentUseCaseRequest): Promise<DeleteCommentUseCaseResponse>{
        const comment = await this.commentsRepository.delete(commentId)
        
        if (!comment) {
            throw new ResourceNotFoundError()
        }

        return { comment }
    }
    
    
}