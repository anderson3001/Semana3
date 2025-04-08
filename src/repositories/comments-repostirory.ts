import { Comment, Prisma } from "@prisma/client";

export interface CommentUpdateInput {
    content: string
}


export interface CommentsRepository {
    create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment>
    findAll(): Promise<Comment[]>
    delete(id: string): Promise<Comment | null>
    findById(id: string): Promise<Comment | null>
    update(id: string, data: CommentUpdateInput): Promise<Comment | null>
    findByUserId(userId: string): Promise<Comment[]>
    findByPostId(postId: string): Promise<Comment[]>
}