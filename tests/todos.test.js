const request = require('supertest')
const dotenv = require('dotenv')
dotenv.config()

const baseUrl = `${process.env.HOST}:${process.env.HOST_PORT}${process.env.PREFIX}` ?? 'localhost:5000/v1/api'
const todo = {
    name: 'Test TODO',
    description: 'TEST',
}
let newTodo

describe('Create TODO', () => {
    let newTodoId
    afterAll(async () => {
        await request(baseUrl).delete(`/todos/${newTodoId}`)
    })

    it('Should create a new TODO', async () => {
        const res = await request(baseUrl)
            .post('/todos')
            .send(todo)

        newTodoId = res.body.data.id
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('data')
        expect(res.body).toHaveProperty('message')
    })
})

describe('Get TODOS', () => {
    beforeAll(async () => {
        newTodo = await request(baseUrl).post('/todos').send(todo);
    })
    afterAll(async () => {
        await request(baseUrl).delete(`/todos/${newTodo.body.data.id}`)
    })

    it('Should get TODOs', async () => {
        const res = await request(baseUrl).get('/todos')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('max_page')
        expect(res.body).toHaveProperty('current_page')
        expect(res.body).toHaveProperty('data')
    })
})

describe('Get TODO', () => {
    beforeAll(async () => {
        newTodo = await request(baseUrl).post('/todos').send(todo);
    })
    afterAll(async () => {
        await request(baseUrl).delete(`/todos/${newTodo.body.data.id}`)
    })

    it('Should get TODO', async () => {
        const res = await request(baseUrl).get(`/todos/${newTodo.body.data.id}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('Update TODO', () => {
    beforeAll(async () => {
        newTodo = await request(baseUrl).post('/todos').send(todo);
    })
    afterAll(async () => {
        await request(baseUrl).delete(`/todos/${newTodo.body.data.id}`)
    })

    it('Should update TODO', async () => {
        const res = await request(baseUrl).put(`/todos/${newTodo.body.data.id}`).send({
            name: 'Todo',
            description: 'updated'
        })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
    })
})

describe('Delete TODO', () => {
    beforeAll(async () => {
        newTodo = await request(baseUrl).post('/todos').send(todo);
    })

    it('Should update TODO', async () => {
        const res = await request(baseUrl).delete(`/todos/${newTodo.body.data.id}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
    })
})