import { Post } from "@prisma/client";
import cron from "node-cron";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { PrismaPostsRepository } from "../repositories/prisma/prisma-posts-repository";
import { PrismaLikesRepository } from "../repositories/prisma/prisma-likes-repository";
import { GetMostLikedPosts } from "../use-cases/posts/get-most-liked-posts-use-case";
import { weeklyPostSummary } from "../services/email";

cron.schedule("0 9 * * 1", async () => {
    const prismaUsersRepository = new PrismaUsersRepository();
    const prismaPostsRepository = new PrismaPostsRepository();
    const prismaLikesRepository = new PrismaLikesRepository();
  
    const getAllLikeUseCase = new GetMostLikedPosts(
      prismaPostsRepository,
      prismaLikesRepository
    );
  
    const allUsers = await prismaUsersRepository.findAll();
  
    const mostLikedPosts: Post[] = await getAllLikeUseCase.execute({});
  
    allUsers.forEach((user) => {
      weeklyPostSummary(user.email, user.name, mostLikedPosts);
    });
  });