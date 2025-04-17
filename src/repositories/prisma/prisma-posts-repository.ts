import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginatedPosts, PostsRepository, PostUpdateInput } from "../posts-repository";

export class PrismaPostsRepository implements PostsRepository {
    async findManyById(postIds: string[]): Promise<Post[]> {
        const posts = await prisma.post.findMany({//pros mais curtidos da semana
          where: {
            id: {
              in: postIds,
            },
            deleted_at: null
          },
        });
    
        return posts;
      }
    
    async findByUserId(userId: string): Promise<Post[]> {
        const posts = await prisma.post.findMany({
            where: {
                userId,
                deleted_at: null
            }
        })
        return posts
    }
    async findAll(paginatedPosts: PaginatedPosts): Promise<Post[]> {
        const { page, limit, title, content, orderBy } = paginatedPosts;//desconstruindo pra usar ali no AND

        let order: any = { created_at: 'desc' };//ordem de criaçaõ se n tiver nenhum especificado

        if (orderBy === 'LIKES') {
          order = { likes: { _count: 'desc' } };
        } else if (orderBy === 'COMMENTS') {
          order = { comments: { _count: 'desc' } };
        }

        const posts = await prisma.post.findMany({
            where: {
                deleted_at: null,
                AND: [
                    title ? { title: { contains: title, mode: 'insensitive' } } : {},
                    content ? { content: { contains: content, mode: 'insensitive' } } : {}
                ]
            },
            take: paginatedPosts.limit,
            skip: (paginatedPosts.page - 1) * paginatedPosts.limit,
            orderBy: order,
            include: {
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            }
        })
        return posts
    }
    async update(id: string, data: PostUpdateInput): Promise<Post | null> {
        const post = await prisma.post.update({
            where: {
                id
            },
            data: {
                title: data.title,
                content: data.content
            }
        })
        return post
    }
    async delete(id: string): Promise<Post | null> {
        const post = await prisma.post.update({
            where: {
                id
            },
            data: {
                deleted_at: new Date()
            }
        })
        return post 
    }
    async findById(id: string){
        const post = await prisma.post.findFirst({
            where: {
                id,
                deleted_at: null
            }
        })
        return post 
    }
    async create(data: Prisma.PostUncheckedCreateInput) {
        const posts = await prisma.post.create({
            data
        }) 
        return posts
    }
    async removeDeletedPosts() {
        const deletedPosts = await prisma.post.deleteMany({
            where: {
                deleted_at: {
                    not: null,
                }
            }
        })
    }
}