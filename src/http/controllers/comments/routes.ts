import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { getAll } from "./get-all";
import { deleteComment } from "./delete";
import { update } from "./update";
import { get } from "./get";
import { getByUser } from "./get-by-user";
import { getByPost } from "./get-by-post";

export function commentsRoutes(app: FastifyInstance) {
    app.post('/comment', { preHandler: [verifyJWT]}, create)//autentificado

    app.get('/comments', getAll)
    app.get('/comment/:commentId', get)
    app.get('/comment/user/:userId', getByUser)
    app.get('/comment/post/:postId', getByPost)

    app.delete('/comment/:commentId', { preHandler: [verifyJWT]}, deleteComment)//autentificado

    app.patch('/comment/:commentId', { preHandler: [verifyJWT]}, update)//autentificado
}