import express from "express";
import {createUser, login, logout} from "../controllers/UserController.js";
import {withJWTAuthMiddleware} from "express-kun";
import {SECRET_KEY} from "../common/constants.js";

const router = express.Router()
const protectedRouter = withJWTAuthMiddleware(router, SECRET_KEY)

// Define todos routers
router.post('/', createUser)
router.post('/login', login)
protectedRouter.post('/logout', logout)

export default router