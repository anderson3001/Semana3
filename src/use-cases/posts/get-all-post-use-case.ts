import { Post } from "@prisma/client"
import { PostsRepository } from "../../repositories/posts-repository"

interface GetAllPostsUseCaseRequest {
    page: number;
    limit: number;
    title?: string;
    content?: string;
  }
interface GetPostUseCaseResponse {
    post: Post[]
}


export class GetAllPostsUseCase{

    constructor(private postsRepository: PostsRepository) {}

    async execute(getAllPostsUseCaseRequest: GetAllPostsUseCaseRequest): Promise<GetPostUseCaseResponse>{
        const post = await this.postsRepository.findAll(getAllPostsUseCaseRequest)
        
        return { post }
    }
    
    
}