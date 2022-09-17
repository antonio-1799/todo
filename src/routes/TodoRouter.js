import express from "express";
import {
    completeTodo,
    createTodos,
    deleteTodo,
    readTodo,
    readTodos,
    updateTodo
} from "../controllers/TodoController.js";

const router = express.Router()

// Define todos routers
router.post('/', createTodos)
router.get('/', readTodos)
router.get('/:id', readTodo)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)
router.patch('/:id', completeTodo)

export default router