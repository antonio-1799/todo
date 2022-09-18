import * as dotenv from "dotenv";
import supertest from "supertest";
import app from "../src/app.js"
import {format} from "date-fns";

dotenv.config()

const prefix = process.env.PREFIX ?? '/v1/api'
const todo = {
    name: 'Test TODO',
    description: 'This is a description',
    remarks: 'This is a remark'
}
let token

const getToken = async () => {
    const user = {
        username: 'test user',
        password: 'password123'
    }
    // Create user
    await supertest(app)
        .post(`${prefix}/users`)
        .send(user)

    // Login user and get access token
    const loginResponse = await supertest(app)
        .post(`${prefix}/users/login`)
        .send(user)
    return loginResponse.body.data.access_token
}

describe('Create TODO', () => {
    let newTodoId
    beforeAll(async () => {
        token = await getToken()
    })
    afterAll(async () => {
        await supertest(app)
            .delete(`${prefix}/todos/${newTodoId}`)
            .set('Authorization', `Bearer ${token}`)
    })

    it('Should create a new TODO', async () => {
        const res = await supertest(app)
            .post(`${prefix}/todos`)
            .send(todo)
            .set('Authorization', `Bearer ${token}`)

        newTodoId = res.body.data.id
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
    })
})

describe('Get All TODOS and Get TODO', () => {
    let newTodoId
    beforeAll(async () => {
        token = await getToken()

        const todoResponse = await supertest(app)
            .post(`${prefix}/todos`)
            .send(todo)
            .set('Authorization', `Bearer ${token}`)

        newTodoId = todoResponse.body.data.id
    })
    afterAll(async () => {
        await supertest(app)
            .delete(`${prefix}/todos/${newTodoId}`)
            .set('Authorization', `Bearer ${token}`)
    })

    it('Should get TODO', async () => {
        const res = await supertest(app)
            .get(`${prefix}/todos/${newTodoId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
    })

    it('Should get TODOs', async () => {
        const res = await supertest(app)
            .get(`${prefix}/todos`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('max_page')
        expect(res.body).toHaveProperty('current_page')
        expect(res.body).toHaveProperty('data')
    })
})

describe('Update TODO', () => {
    let newTodoId
    beforeAll(async () => {
        token = await getToken()

        const todoResponse = await supertest(app)
            .post(`${prefix}/todos`)
            .send(todo)
            .set('Authorization', `Bearer ${token}`)

        newTodoId = todoResponse.body.data.id
    })
    afterAll(async () => {
        await supertest(app)
            .delete(`${prefix}/todos/${newTodoId}`)
            .set('Authorization', `Bearer ${token}`)
    })

    it('Should update TODO', async () => {
        const res = await supertest(app)
            .put(`${prefix}/todos/${newTodoId}`)
            .send({
                name: 'Updated Todo',
                description: 'Updated description',
                remarks: 'Updated remarks'
            })
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('updatedAt')
    })
})

describe('Delete TODO', () => {
    let newTodoId
    beforeAll(async () => {
        token = await getToken()

        const todoResponse = await supertest(app)
            .post(`${prefix}/todos`)
            .send(todo)
            .set('Authorization', `Bearer ${token}`)

        newTodoId = todoResponse.body.data.id
    })

    it('Should delete TODO', async () => {
        const res = await supertest(app)
            .delete(`${prefix}/todos/${newTodoId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
    })
})

describe('Complete TODO', () => {
    let newTodoId
    beforeAll(async () => {
        token = await getToken()

        const todoResponse = await supertest(app)
            .post(`${prefix}/todos`)
            .send(todo)
            .set('Authorization', `Bearer ${token}`)

        newTodoId = todoResponse.body.data.id
    })
    afterAll(async () => {
        await supertest(app)
            .delete(`${prefix}/todos/${newTodoId}`)
            .set('Authorization', `Bearer ${token}`)
    })

    it('Should complete TODO', async () => {
        const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        const res = await supertest(app)
            .put(`${prefix}/todos/${newTodoId}/complete`)
            .send({ completedAt: date})
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('completedAt')
    })
})