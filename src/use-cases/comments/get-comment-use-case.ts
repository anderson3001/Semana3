import { Comment} from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { CommentsRepository } from "../../repositories/comments-repostirory"

interface GetCommentUseCaseRequest {
    commentId: string
}
interface GetCommentUseCaseResponse {
    comment: Comment
}


export class GetCommentUseCase{

    constructor(private commentsRepository: CommentsRepository) {}

    async execute({commentId}: GetCommentUseCaseRequest): Promise<GetCommentUseCaseResponse>{
        const comment = await this.commentsRepository.findById(commentId)
        
        if (!comment) {
            throw new ResourceNotFoundError()
        }

        return { comment }
    }
    
    
}