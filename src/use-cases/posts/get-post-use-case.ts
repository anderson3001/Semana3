import { Post } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { PostsRepository } from "../../repositories/posts-repository"

interface GetPostUseCaseRequest {
    postId: string
}
interface GetPostUseCaseResponse {
    post: Post
}


export class GetPostUseCase{

    constructor(private postsRepository: PostsRepository) {}

    async execute({postId}: GetPostUseCaseRequest): Promise<GetPostUseCaseResponse>{
        const post = await this.postsRepository.findById(postId)
        
        if (!post) {
            throw new ResourceNotFoundError()
        }

        return { post }
    }
    
    
}