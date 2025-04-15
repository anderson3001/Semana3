import { Comment } from "@prisma/client"
import { CommentsRepository } from "../../repositories/comments-repostirory"

interface GetAllCommentsUseCaseResponse {
    comment: Comment[]
}


export class GetAllCommentsUseCase{

    constructor(private commentsRepository: CommentsRepository) {}

    async execute(): Promise<GetAllCommentsUseCaseResponse>{
        const comment = await this.commentsRepository.findAll()
        
        return { comment }
    }
    
    
}