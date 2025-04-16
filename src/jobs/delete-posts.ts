import cron from "node-cron";
import { PrismaCommentsRepository } from "../repositories/prisma/prisma-comments-repository";
import { PrismaPostsRepository } from "../repositories/prisma/prisma-posts-repository";
cron.schedule("0 0 1 * *", async () => {
    const prismaCommentsRepository = new PrismaCommentsRepository();
    const prismaPostsRepository = new PrismaPostsRepository();

    await prismaCommentsRepository.removeDeletedComments();
    await prismaPostsRepository.removeDeletedPosts();
});