import express from "express";
import todosRoutes from "./TodoRouter.js";
import userRouter from "./UserRouter.js";

// Create base router
const baseRouter = express.Router()

// Define specific routers
baseRouter.use('/todos', todosRoutes)
baseRouter.use('/users', userRouter)

export default baseRouter