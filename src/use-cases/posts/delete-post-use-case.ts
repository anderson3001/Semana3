import { Post, User } from "@prisma/client"
import { PostsRepository } from "../../repositories/posts-repository"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"

interface DeletePostUseCaseRequest {
    postId: string
}
interface DeletePostUseCaseResponse {
    post: Post
}


export class DeletePostUseCase{

    constructor(private postsRepository: PostsRepository) {}

    async execute({postId}: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse>{
        const post = await this.postsRepository.delete(postId)
        
        if (!post) {
            throw new ResourceNotFoundError()
        }

        return { post }
    }
    
    
}