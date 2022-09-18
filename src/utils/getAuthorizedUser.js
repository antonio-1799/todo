import {getTokenFromBearer} from "express-kun";
import jwt from "jsonwebtoken"
import Users from "../models/UserModel.js";

export default async (req) => {
    const token = getTokenFromBearer(req)
    const decoded = jwt.decode(token, { json: true })

    const user = await Users.findByPk(decoded.id)
    if (!user) return null

    return {
        id: user.id,
        username: user.username
    }
}