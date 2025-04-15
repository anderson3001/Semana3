import { Comment, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PostUpdateInput } from "../posts-repository";
import { CommentUpdateInput } from "../comments-repostirory";

export class PrismaCommentsRepository {
    async create(data: Prisma.CommentUncheckedCreateInput) {
        const comment = await prisma.comment.create({
            data
        })
        return comment
    }
    async findAll(): Promise<Comment[]> {
        const comments = await prisma.comment.findMany()
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
        const comment = await prisma.comment.findUnique({
            where: {
                id
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
                userId
            }
        })
        return comments
    }
    async findByPostId(postId: string): Promise<Comment[]> {
        const comments = await prisma.comment.findMany({
            where: {
                postId
            }
        })
        return comments
    }
}