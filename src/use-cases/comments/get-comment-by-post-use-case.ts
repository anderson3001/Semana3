import { Comment, Like } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { CommentsRepository } from "../../repositories/comments-repostirory"

interface GetCommentUseCaseRequest {
    postId: string
}
interface GetCommentUseCaseResponse {
    comment: Comment[]
}


export class GetCommentByPostUseCase{

    constructor(private commentsRepository: CommentsRepository) {}

    async execute({postId}: GetCommentUseCaseRequest): Promise<GetCommentUseCaseResponse>{
        const comment = await this.commentsRepository.findByPostId(postId)
        
        if (!comment) {
            throw new ResourceNotFoundError()
        }

        return { comment }
    }
    
    
}