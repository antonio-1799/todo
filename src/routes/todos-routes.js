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

// Define routers
router.post('/todos', createTodos)
router.get('/todos', readTodos)
router.get('/todos/:id', readTodo)
router.put('/todos/:id', updateTodo)
router.delete('/todos/:id', deleteTodo)

export default router