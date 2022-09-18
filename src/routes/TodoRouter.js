import {
    completeTodo,
    createTodos,
    deleteTodo,
    readTodo,
    readTodos,
    updateTodo
} from "../controllers/TodoController.js";
import express from "express";
import createProtectedRouter from "../utils/createProtectedRouter.js";

const router = express.Router()
const protectedRouter = await createProtectedRouter(router)

// Define todos routers
protectedRouter.post('/', createTodos)
protectedRouter.get('/', readTodos)
protectedRouter.get('/:id', readTodo)
protectedRouter.put('/:id', updateTodo)
protectedRouter.delete('/:id', deleteTodo)
protectedRouter.put('/:id/complete', completeTodo)

export default router