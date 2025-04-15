import { Post } from "@prisma/client"
import { ResourceNotFoundError } from "../@errors/resource-not-found-error"
import { PostsRepository, PostUpdateInput } from "../../repositories/posts-repository"

interface UpdatePostUseCaseRequest {
    postId: string,
    data: PostUpdateInput
}
interface UpdatePostUseCaseResponse {
    post: Post
}


export class UpdatePostUseCase{

    constructor(private postsRepository: PostsRepository) {}

    async execute({postId, data}: UpdatePostUseCaseRequest): Promise<UpdatePostUseCaseResponse>{
        const post = await this.postsRepository.findById(postId)
        
        if (!post) {
            throw new ResourceNotFoundError()
        }

        const postUpdated = await this.postsRepository.update(postId, data)
        if (!postUpdated) {
            throw new ResourceNotFoundError()
        }

        return { post: postUpdated }
    }
    
    
}