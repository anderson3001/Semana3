import { Comment } from "@prisma/client"
import { CommentsRepository } from "../../repositories/comments-repostirory"

interface GetAllCommentsUseCaseResponse {
    comment: Comment[]
}
interface GetAllCommentsUseCaseRequest {
    page: number,
    limit: number
}


export class GetAllCommentsUseCase{

    constructor(private commentsRepository: CommentsRepository) {}

    async execute(getallCommentsUseCaseRequest: GetAllCommentsUseCaseRequest): Promise<GetAllCommentsUseCaseResponse>{
        const comment = await this.commentsRepository.findAll(getallCommentsUseCaseRequest)
        
        return { comment }
    }
    
    
}