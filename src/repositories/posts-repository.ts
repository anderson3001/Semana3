import { Post, Prisma} from "@prisma/client";

export interface PostUpdateInput {
    title?: string,
    content?: string,
}

export interface PostsRepository {
    create(data: Prisma.PostUncheckedCreateInput): Promise<Post>//precisa de autentificação
    findById(postId: string): Promise<Post | null>
    delete(id: string): Promise<Post | null>
    update(id: string, data: PostUpdateInput): Promise<Post | null>
    findAll(): Promise<Post[]>
    findByUserId(userId: string): Promise<Post[]>
    findManyById(postIds: string[]): Promise<Post[]>;
}