import {
    completeTodo,
    createTodos,
    deleteTodo,
    readTodo,
    readTodos,
    updateTodo
} from "../controllers/TodoController.js";
import express from "express";
import {withJWTAuthMiddleware} from "express-kun";
import {SECRET_KEY} from "../common/constants.js";

const router = express.Router()
const protectedRouter = withJWTAuthMiddleware(router, SECRET_KEY)

// Define protected todos routers
protectedRouter.post('/', createTodos)
protectedRouter.get('/', readTodos)
protectedRouter.get('/:id', readTodo)
protectedRouter.put('/:id', updateTodo)
protectedRouter.delete('/:id', deleteTodo)
protectedRouter.put('/:id/complete', completeTodo)

export default router