import { Post } from "@prisma/client"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { PostsRepository } from "../repositories/posts-repository"

interface GetPostUseCaseRequest {
    userId: string
}
interface GetPostUseCaseResponse {
    post: Post[]
}


export class GetPostByUserUseCase{

    constructor(private postsRepository: PostsRepository) {}

    async execute({userId}: GetPostUseCaseRequest): Promise<GetPostUseCaseResponse>{
        const post = await this.postsRepository.findByUserId(userId)
        
        if (!post) {
            throw new ResourceNotFoundError()
        }

        return { post }
    }
    
    
}