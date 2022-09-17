import Todos from "../models/todos-model.js";
import Validator from "validatorjs";
import {Op} from "sequelize";
import {StatusCodes, TodosStatus} from "../../common/enums.js";
import {format} from "date-fns";
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "../../common/constants.js";
import {ApiResponse} from "../../common/response.js";
import pagination from "../helpers/pagination.js";

const response = new ApiResponse()

export const createTodos = async (req, res) => {
    try {
        const validation = new Validator(req.body, {
            name: ['required', 'max:10'],
            description: ['required', 'max:25']
        })

        if (validation.fails()) {
            let errors = validation.errors.all()
            let details = errors[Object.keys(errors)[0]][0]

            return response.error(res, errors, details, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        const todo = await Todos.create(req.body);
        const data = {
            id: todo.id,
            name: todo.name,
            description: todo.description,
            createdAt: format(todo.createdAt, 'yyyy-MM-dd HH:mm:ss')
        }
        return response.success(res, `Todo created successfully with id ${todo.id}`, data, StatusCodes.CREATED)
    } catch (err) {
        return response.error(res, err)
    }
}

export const readTodos = async (req, res) => {
    try {
        const search = req.query.search ?? ''
        let page, limit

        // Initialize page and limit
        page = isNaN(Number(req.query.page)) ? DEFAULT_PAGE : Number(req.query.page)
        limit = isNaN(Number(req.query.limit)) ? DEFAULT_LIMIT : Number(req.query.limit)

        const todosCount = await Todos.count({
            where: {
                name: {
                    [Op.like]: `%${search}%`
                },
                status: TodosStatus.ACTIVE
            }
        })
        const { maxPage, offset } = await pagination(todosCount, limit, page)

        let todos
        if (!search) {
            console.log('Return all applications')
            todos = await Todos.findAll({
                where: {
                    status: TodosStatus.ACTIVE
                },
                offset,
                limit
            })
        } else {
            console.log('Return all applications with optional search')
            todos = await Todos.findAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    },
                    status: TodosStatus.ACTIVE
                },
                offset,
                limit
            })
        }

        return response.successWithPagination(res, maxPage, page, todos)
    } catch (err) {
        return response.error(res, err)
    }
}

export const readTodo = async (req, res) => {
    try {
        const todo = await Todos.findByPk(req.params.id)
        if (!todo) {
            return response.error(res, 'Not Found', `No todo found for id ${req.params.id}`, StatusCodes.NOT_FOUND)
        }

        return response.success(res, `Todo ${todo.id}`, todo)
    } catch (err) {
        return response.error(res, err)
    }
}

export const updateTodo = async (req, res) => {
    try {
        const validation = new Validator(req.body, {
            name: ['required', 'string', 'max:10'],
            description: ['required', 'string', 'max:25']
        })

        if (validation.fails()) {
            let errors = validation.errors.all()
            let details = errors[Object.keys(errors)[0]][0]

            return response.error(res, errors, details, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        const todo = await Todos.findByPk(req.params.id)
        if (!todo) {
            return response.error(res, 'Not Found', `No todo found for id ${req.params.id}`, StatusCodes.NOT_FOUND)
        }

        // Update name and description
        todo.name = req.body.name
        todo.description = req.body.description
        await todo.save()

        const data = {
            id: todo.id,
            name: todo.name,
            description: todo.description,
            updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }

        return response.success(res, `Todo updated successfully with id ${todo.id}`, data)
    } catch (err) {
        return response.error(res, err)
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todos.findByPk(req.params.id)
        if (!todo) {
            return response.error(res, 'Not Found', `No todo found for id ${req.params.id}`, StatusCodes.NOT_FOUND)
        }

        await Todos.destroy({
            where: {
                id: req.params.id
            }
        })

        return response.success(res, `Todo deleted successfully with id ${req.params.id}`)
    } catch (err) {
        return response.error(res, err)
    }
}

