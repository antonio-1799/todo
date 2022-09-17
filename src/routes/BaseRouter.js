import express from "express";
import todosRoutes from "./TodoRouter.js";

// Create base router
const baseRouter = express.Router()

// Define specific routers
baseRouter.use('/todos', todosRoutes)

export default baseRouter