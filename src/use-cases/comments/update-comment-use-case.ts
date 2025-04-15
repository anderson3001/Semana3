import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { CommentsRepository, CommentUpdateInput } from "../../repositories/comments-repostirory"
import { Comment } from "@prisma/client"

interface UpdateCommentUseCaseRequest {
    commentId: string,
    data: CommentUpdateInput
}
interface UpdateCommentUseCaseResponse {
    comment: Comment
}


export class UpdateCommentUseCase{

    constructor(private commentsRepository: CommentsRepository) {}

    async execute({commentId, data}: UpdateCommentUseCaseRequest): Promise<UpdateCommentUseCaseResponse>{
        const comment = await this.commentsRepository.findById(commentId)
        
        if (!comment) {
            throw new ResourceNotFoundError()
        }

        const commentUpdated = await this.commentsRepository.update(commentId, data)
        if (!commentUpdated) {
            throw new ResourceNotFoundError()
        }

        return { comment: commentUpdated }
    }
    
    
}