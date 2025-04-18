import { Like, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { LikesRepository } from "../likes-repository";

export class PrismaLikesRepository implements LikesRepository {
    async create(data: Prisma.LikeUncheckedCreateInput): Promise<Like> {
        const like = await prisma.like.create({
            data
        })
        return like
    }
    async delete(id: string): Promise<Like | null> {
        const like = await prisma.like.delete({
            where: {
                id
            }
        })
        return like
    }
    async findById(id: string){
        const like = await prisma.like.findUnique({
            where: {
                id
            }
        })
        return like 
    }
    async findByUserId(userId: string): Promise<Like[]> {
        const likes = await prisma.like.findMany({
            where: {
                userId
            }
        })
        return likes
    }
    async findByPostId(postId: string): Promise<Like[]> {
        const likes = await prisma.like.findMany({
            where: {
                postId
            }
        })
        return likes
    }
    async findByCommentId(commentId: string): Promise<Like[]> {
        const likes = await prisma.like.findMany({
            where: {
                commentId
            }
        })
        return likes
    }
    async getMostLikedPostIds(limit: number) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const topPosts = await prisma.like.groupBy({
            by: ['postId'],
            where: {
                created_at: {
                  gte: oneWeekAgo,
                },
              },
            _count: {
                postId: true,
            },
            orderBy: {
                _count: {
                    postId: 'desc',
                },
            },
            take: limit,
        });
        
        const postIds = topPosts.map((like) => {
            if (like.postId) return [like.postId, like._count.postId];
          });
      
          const filteredLikes = postIds.filter((like) => !!like);
      
          return filteredLikes;
    }
}
