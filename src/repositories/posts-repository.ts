import { Post, Prisma} from "@prisma/client";

export interface PostUpdateInput {
    title?: string,
    content?: string,
}
export interface PaginatedPosts {
    page: number;
    limit: number;

    title?: string;
    content?: string;

    orderBy?: "LIKES" | "COMMENTS" | "LATEST"
}

export interface PostsRepository {
    create(data: Prisma.PostUncheckedCreateInput): Promise<Post>//precisa de autentificação
    findById(postId: string): Promise<Post | null>
    delete(id: string): Promise<Post | null>
    update(id: string, data: PostUpdateInput): Promise<Post | null>
    findAll(paginatedPosts: PaginatedPosts): Promise<Post[]>
    findByUserId(userId: string): Promise<Post[]>
    findManyById(postIds: string[]): Promise<Post[]>;
    removeDeletedPosts(): Promise<void>;
}