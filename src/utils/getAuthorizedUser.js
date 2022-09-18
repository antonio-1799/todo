import {getTokenFromBearer} from "express-kun";
import jwt from "jsonwebtoken"
import Users from "../models/UserModel.js";
import RevokedTokens from "../models/RevokedTokenModel.js";

export default async (req) => {
    const token = getTokenFromBearer(req)
    // Revoked tokens
    const revokedToken = await RevokedTokens.findOne({
        where: {
            token
        },
    })
    if (revokedToken) return null

    const decoded = jwt.decode(token, { json: true })

    // User not found using id from decoded payload
    const user = await Users.findByPk(decoded.id)
    if (!user) return null

    return {
        id: user.id,
        username: user.username
    }
}