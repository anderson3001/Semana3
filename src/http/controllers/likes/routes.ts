import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { deleteLike } from "./delete";
import { get } from "./get";
import { getByUser } from "./get-by-user";
import { getByPost } from "./get-by-post";
import { getByComment } from "./get-by-comment";

export function likesRoutes(app: FastifyInstance) {
    app.post('/like', { preHandler: [verifyJWT]}, create)//autentificado

    app.delete('/like/:likeId', { preHandler: [verifyJWT]}, deleteLike)//autentificado

    app.get('/like/:likeId', get)
    app.get('/like/user/:userId', getByUser)
    app.get('/like/post/:postId', getByPost)
    app.get('/like/comment/:commentId', getByComment)
    
}