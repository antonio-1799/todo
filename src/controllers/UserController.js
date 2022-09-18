import {ApiResponse} from "../utils/response.js";
import Validator from "validatorjs";
import {StatusCodes} from "../common/enums.js";
import _ from "underscore";
import {v4 as uuidv4} from "uuid";
import {format} from "date-fns";
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {SECRET_KEY} from "../common/constants.js";
import {getTokenFromBearer} from "express-kun";
import RevokedTokens from "../models/RevokedTokenModel.js";

const response = new ApiResponse()

export const createUser = async (req, res) => {
    try {
        const validation = new Validator(req.body, {
            username: ['required', 'string', 'max:10'],
            password: ['required', 'string', 'max:12'],
        })

        if (validation.fails()) {
            let errors = validation.errors.all()
            let details = errors[Object.keys(errors)[0]][0]

            return response.error(res, errors, details, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        const existingUser = await Users.findOne({
            where: {
                username: req.body.username
            }
        })
        if (existingUser) return response.error(res, 'Conflict',
            'User already exist', StatusCodes.CONFLICT)

        // Add uuid in body for primary key
        _.extend(req.body, { id: uuidv4() })

        const user = await Users.create(req.body);
        const data = {
            id: user.id,
            createdAt: format(user.createdAt, 'yyyy-MM-dd HH:mm:ss')
        }
        return response.success(res, `User created successfully with id ${user.id}`, data, StatusCodes.CREATED)
    } catch (err) {
        return response.error(res, err.message)
    }
}

export const login = async (req, res) => {
    try {
        const validation = new Validator(req.body, {
            username: ['required', 'string', 'max:10'],
            password: ['required', 'string', 'max:12'],
        })

        if (validation.fails()) {
            let errors = validation.errors.all()
            let details = errors[Object.keys(errors)[0]][0]

            return response.error(res, errors, details, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        const user = await Users.findOne({
            where: {
                username: req.body.username
            }
        })

        if (!user) return response.error(res, 'Not Found', 'User not found', StatusCodes.NOT_FOUND)
        if (!bcrypt.compareSync(req.body.password, user.password))
            return response.error(res, 'Unauthorized',
                'Password incorrect. Please try again.', StatusCodes.UNAUTHORIZED)

        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, SECRET_KEY, {
            expiresIn: '30m'
        })

        const data = {
            access_token: token
        }

        return response.success(res, `Login successful`, data, StatusCodes.OK)
    } catch (err) {
        return response.error(res, err.message)
    }
}

export const logout = async (req, res) => {
    try {
        const token = getTokenFromBearer(req)

        const [revokedToken, created] = await RevokedTokens.findOrCreate({
            where: {
                token
            },
            defaults: {
                id: uuidv4(),
                token
            }
        })
        if (!created) return response.error(res, 'Unauthorized', 'Unauthorized', StatusCodes.UNAUTHORIZED)

        return response.success(res, `User logout successfully`, null, StatusCodes.OK)
    } catch (err) {
        return response.error(res, err.message)
    }
}