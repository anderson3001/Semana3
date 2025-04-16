import { Comment, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { CommentUpdateInput, PaginatedComments } from "../comments-repostirory";

export class PrismaCommentsRepository {
    async create(data: Prisma.CommentUncheckedCreateInput) {
        const comment = await prisma.comment.create({
            data
        })
        return comment
    }
    async findAll(paginatedComments: PaginatedComments): Promise<Comment[]> {
        const comments = await prisma.comment.findMany({
            where: {
                deleted_at: null
            },
            take: paginatedComments.limit,
            skip: (paginatedComments.page - 1) * paginatedComments.limit,
        })
        return comments
    }
    async delete(id: string): Promise<Comment | null> {
        const comment = await prisma.comment.update({
            where: {
                id
            },
            data: {
                deleted_at: new Date()
            }
        })
        return comment 
    }
    async findById(id: string){
        const comment = await prisma.comment.findFirst({
            where: {
                id,
                deleted_at: null
            }
        })
        return comment 
    }
   async update(id: string, data: CommentUpdateInput): Promise<Comment | null> {
        const comment = await prisma.comment.update({
            where: {
                id
            },
            data: {
                content: data.content
            }
        })
        return comment
    }
    async findByUserId(userId: string): Promise<Comment[]> {
        const comments = await prisma.comment.findMany({
            where: {
                userId,
                deleted_at: null
            }
        })
        return comments
    }
    async findByPostId(postId: string): Promise<Comment[]> {
        const comments = await prisma.comment.findMany({
            where: {
                postId,
                deleted_at: null
            }
        })
        return comments
    }
    async removeDeletedComments(){
        const deletedComments = await prisma.comment.deleteMany({
            where: {
                deleted_at: {
                    not: null
                }
            }
        })
    }
}