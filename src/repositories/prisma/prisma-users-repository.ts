import { Prisma, User} from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { UsersRepository, UserUpdateInput } from "../users-repostory";

export class PrismaUsersRepository implements UsersRepository {
    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany()
        return users
    }
    async update(id: string, data: UserUpdateInput): Promise<User | null> {
        const user = await prisma.user.update({
            where: {
                id
            },
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                photo: data.photo
            }
        })
        return user
    
    }
    async delete(id: string): Promise<User | null> {
        const posts = await prisma.post.deleteMany({//pra deletar os posts antes de deletar o usuario
            where: {
                userId: id
            }
        })
        const user = await prisma.user.delete({
            where: {
                id
            }
        })
        return user 
    }
    async findById(id: string){
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        return user 
    }
    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        return user
    }

    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({
            data
        })

        return user 
    }
}