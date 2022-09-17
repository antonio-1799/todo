import express from "express";
import {
    createTodos,
    deleteTodo,
    readTodo,
    readTodos,
    updateTodo
} from "../controllers/todos-controller.js";

// Init express router
const router = express.Router()

// Define todos routers
router.post('/', createTodos)
router.get('/', readTodos)
router.get('/:id', readTodo)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router