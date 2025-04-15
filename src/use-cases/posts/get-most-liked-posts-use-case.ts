import { Like, Post } from "@prisma/client";
import { PostsRepository } from "../../repositories/posts-repository";
import { LikesRepository } from "../../repositories/likes-repository";

interface GetMostLikedPostsRequest {}

interface GetMostLikedPostsResponse {
  likes: Like[];
}

export class GetMostLikedPosts {
    constructor(
      private postsRepository: PostsRepository,
      private likesRepository: LikesRepository
    ) {}

    async execute({}: GetMostLikedPostsRequest): Promise<Post[]> {
        const mostLikedPostIDs = await this.likesRepository.getMostLikedPostIds(5);
        const mostLikedPosts = await this.postsRepository.findManyById(
          mostLikedPostIDs.map(like => like[0]) as string[]
        );
    
        return mostLikedPosts;
      }
}