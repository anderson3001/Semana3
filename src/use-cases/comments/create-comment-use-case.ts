import { Comment} from "@prisma/client"
import { CommentsRepository } from "../../repositories/comments-repostirory"
import { newCommentEmail } from "../../services/email"

interface CreateCommentUseCaseRequest {
    content: string,
    userId: string,
    postId: string
}
interface CreateCommentUseCaseResponse {
    comment: Comment
}


export class CreateCommentUseCase{

    constructor(private commentsRepository: CommentsRepository) {}

    async execute({content, userId, postId}: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
    
        const comment = await this.commentsRepository.create({
            content,
            userId,
            postId
        })

        await newCommentEmail(postId)
        return { comment }
    }
}