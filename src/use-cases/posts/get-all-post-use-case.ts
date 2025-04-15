import { Post } from "@prisma/client"
import { PostsRepository } from "../../repositories/posts-repository"

interface GetPostUseCaseResponse {
    post: Post[]
}


export class GetAllPostsUseCase{

    constructor(private postsRepository: PostsRepository) {}

    async execute(): Promise<GetPostUseCaseResponse>{
        const post = await this.postsRepository.findAll()
        
        return { post }
    }
    
    
}