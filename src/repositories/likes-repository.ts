import { Like, Prisma} from "@prisma/client";

export interface LikesRepository {
    create(data: Prisma.LikeUncheckedCreateInput): Promise<Like>
    delete(id: string): Promise<Like | null>
    findById(id: string): Promise<Like | null>//pra verificar id do user na função anterior
    findByUserId(userId: string): Promise<Like[]>
    findByPostId(postId: string): Promise<Like[]>
    findByCommentId(commentId: string): Promise<Like[]>
    getMostLikedPostIds(limit: number): Promise<(string | number)[][]>
}