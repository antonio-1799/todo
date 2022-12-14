import Todos from "../models/TodoModel.js";
import Validator from "validatorjs";
import {Op} from "sequelize";
import {StatusCodes} from "../common/enums.js";
import {format, getUnixTime, parseISO} from "date-fns";
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "../common/constants.js";
import {ApiResponse} from "../utils/response.js";
import pagination from "../utils/pagination.js";
import { v4 as uuidv4 } from 'uuid';
import _ from "underscore"
import getAuthorizedUser from "../utils/getAuthorizedUser.js";
import validateDateFormat from "../utils/validateDateFormat.js";

const response = new ApiResponse()

export const createTodos = async (req, res) => {
    try {
        const user = await getAuthorizedUser(req)
        if (!user) return response.error(res, 'Unauthorized', 'Unauthorized', StatusCodes.UNAUTHORIZED)

        const validation = new Validator(req.body, {
            name: ['required', 'string', 'max:20'],
            description: ['required', 'string', 'max:50'],
            remarks: ['required', 'string', 'max:50']
        })

        if (validation.fails()) {
            let errors = validation.errors.all()
            let details = errors[Object.keys(errors)[0]][0]

            return response.error(res, errors, details, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        // Add uuid for primary key and user id for foreign key in body
        _.extend(req.body, { id: uuidv4(), userId: user.id })

        const todo = await Todos.create(req.body);
        const data = {
            id: todo.id,
            userId: todo.userId,
            name: todo.name,
            description: todo.description,
            remarks: todo.remarks,
            createdAt: format(todo.createdAt, 'yyyy-MM-dd HH:mm:ss')
        }

        return response.success(res, `Todo created successfully with name ${todo.name}`, data, StatusCodes.CREATED)
    } catch (err) {
        return response.error(res, err.message)
    }
}

export const readTodos = async (req, res) => {
    try {
        const user = await getAuthorizedUser(req)
        if (!user) return response.error(res, 'Unauthorized', 'Unauthorized', StatusCodes.UNAUTHORIZED)

        const search = req.query.search ?? ''
        let page, limit

        // Initialize page and limit
        page = isNaN(Number(req.query.page)) ? DEFAULT_PAGE : Number(req.query.page)
        limit = isNaN(Number(req.query.limit)) ? DEFAULT_LIMIT : Number(req.query.limit)

        // Get max page and offset for pagination
        const todosCount = await Todos.count({
            where: {
                userId: user.id,
                name: {
                    [Op.like]: `%${search}%`
                },
            }
        })
        // Early return when no todos found
        if (todosCount === 0) return response.successWithPagination(res, 0, page, [])

        // Paginate to get offset and maxPage
        const { maxPage, offset } = await pagination(todosCount, limit, page)
        let todos
        if (!search) {
            todos = await Todos.findAll({
                attributes: {
                    exclude: ['updatedAt']
                },
                where: {
                    userId: user.id,
                },
                offset,
                limit
            })
        } else {
            todos = await Todos.findAll({
                attributes: {
                    exclude: ['updatedAt']
                },
                where: {
                    userId: user.id,
                    name: {
                        [Op.like]: `%${search}%`
                    },
                },
                offset,
                limit
            })
        }

        const data = todos.map((todo) => {
            return {
                id: todo.id,
                userId: todo.userId,
                name: todo.name,
                description: todo.description,
                remarks: todo.remarks,
                completedAt: todo.completedAt ? format(todo.completedAt, 'yyyy-MM-dd HH:mm:ss') : null,
                createdAt: format(todo.createdAt, 'yyyy-MM-dd HH:mm:ss')
            }
        })

        return response.successWithPagination(res, maxPage, page, data)
    } catch (err) {
        return response.error(res, err.message)
    }
}

export const readTodo = async (req, res) => {
    try {
        const user = await getAuthorizedUser(req)
        if (!user) return response.error(res, 'Unauthorized', 'Unauthorized', StatusCodes.UNAUTHORIZED)

        const todo = await Todos.findOne({
            where: {
                id: req.params.id,
                userId: user.id
            }
        })
        if (!todo) {
            return response.error(res, 'Not Found', `No todo found for id ${req.params.id}`, StatusCodes.NOT_FOUND)
        }

        const data = {
            id: todo.id,
            userId: todo.userId,
            name: todo.name,
            description: todo.description,
            remarks: todo.remarks,
            completedAt: todo.completedAt ? format(todo.completedAt, 'yyyy-MM-dd HH:mm:ss') : null,
            createdAt: format(todo.createdAt, 'yyyy-MM-dd HH:mm:ss'),
            updatedAt: format(todo.updatedAt, 'yyyy-MM-dd HH:mm:ss')
        }

        return response.success(res, `Todo ${todo.name}`, data)
    } catch (err) {
        return response.error(res, err.message)
    }
}

export const updateTodo = async (req, res) => {
    try {
        const user = await getAuthorizedUser(req)
        if (!user) return response.error(res, 'Unauthorized', 'Unauthorized', StatusCodes.UNAUTHORIZED)

        const validation = new Validator(req.body, {
            name: ['required', 'string', 'max:20'],
            description: ['required', 'string', 'max:50'],
            remarks: ['required', 'string', 'max:50']
        })
        if (validation.fails()) {
            let errors = validation.errors.all()
            let details = errors[Object.keys(errors)[0]][0]

            return response.error(res, errors, details, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        const todo = await Todos.findOne({
            where: {
                id: req.params.id,
                userId: user.id
            }
        })
        if (!todo) {
            return response.error(res, 'Not Found', `No todo found for id ${req.params.id}`, StatusCodes.NOT_FOUND)
        }

        // Update name and description
        todo.name = req.body.name
        todo.description = req.body.description
        todo.remarks = req.body.remarks
        await todo.save()

        const data = {
            id: todo.id,
            userId: todo.userId,
            name: todo.name,
            description: todo.description,
            remarks: todo.remarks,
            updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }

        return response.success(res, `Todo updated successfully with name ${todo.name}`, data)
    } catch (err) {
        return response.error(res, err.message)
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const user = await getAuthorizedUser(req)
        if (!user) return response.error(res, 'Unauthorized', 'Unauthorized', StatusCodes.UNAUTHORIZED)

        const todo = await Todos.findOne({
            where: {
                id: req.params.id,
                userId: user.id
            }
        })
        if (!todo) {
            return response.error(res, 'Not Found', `No todo found for id ${req.params.id}`, StatusCodes.NOT_FOUND)
        }

        await Todos.destroy({
            where: {
                id: req.params.id,
                userId: user.id
            }
        })

        return response.success(res, `Todo deleted successfully with id ${req.params.id}`)
    } catch (err) {
        return response.error(res, err.message)
    }
}

export const completeTodo = async (req, res) => {
    try {
        const user = await getAuthorizedUser(req)
        if (!user) return response.error(res, 'Unauthorized', 'Unauthorized', StatusCodes.UNAUTHORIZED)

        const validation = new Validator(req.body, {
            completedAt: ['required', 'date'],
        })
        if (validation.fails()) {
            let errors = validation.errors.all()
            let details = errors[Object.keys(errors)[0]][0]

            return response.error(res, errors, details, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        if (!await validateDateFormat(req.body.completedAt))
            return response.error(res, 'Bad Request', `Date format should be yyyy-MM-dd HH:mm:ss`, StatusCodes.BAD_REQUEST)

        const todo = await Todos.findOne({
            where: {
                id: req.params.id,
                userId: user.id
            }
        })
        if (!todo) {
            return response.error(res, 'Not Found', `No todo found for id ${req.params.id}`, StatusCodes.NOT_FOUND)
        }
        if (todo.completedAt) return response.error(res, 'Conflict', `Todo ${todo.id} already completed`, StatusCodes.CONFLICT)

        // Completed at should be greater than that its created date
        const completedAtDate = parseISO(req.body.completedAt)

        const dateUnix = getUnixTime(completedAtDate)
        const createdAtUnix = getUnixTime(todo.createdAt)
        if (createdAtUnix > dateUnix)
            return response.error(res, 'Bad Request',
                `Completed at date should be greater than todo created date`, StatusCodes.BAD_REQUEST)

        const dateNowUnix = getUnixTime(new Date())
        if (dateUnix > dateNowUnix)
            return response.error(res, 'Bad Request',
                `Completed at date should be less than date today`, StatusCodes.BAD_REQUEST)

        todo.completedAt = completedAtDate
        await todo.save()

        const data = {
            id: todo.id,
            completedAt: todo.completedAt ? format(todo.completedAt, 'yyyy-MM-dd HH:mm:ss') : null,
            updatedAt: format(todo.updatedAt, 'yyyy-MM-dd HH:mm:ss')
        }

        return response.success(res, `Todo completed successfully with id ${req.params.id}`, data)
    } catch (err) {
        return response.error(res, err.message)
    }
}

