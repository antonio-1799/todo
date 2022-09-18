import {withJWTAuthMiddleware} from "express-kun";
import {SECRET_KEY} from "../common/constants.js";

export default async (router) => {
    return withJWTAuthMiddleware(router, SECRET_KEY)
}