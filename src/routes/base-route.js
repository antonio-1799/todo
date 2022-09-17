import express from "express";
import todosRoutes from "./todos-routes.js";

// Init express router
const baseRouter = express.Router()

// Define routers
baseRouter.use('/todos', todosRoutes)

export default baseRouter