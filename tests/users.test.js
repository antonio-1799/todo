import * as dotenv from "dotenv";
import supertest from "supertest";
import app from "../src/app.js"
import randomstring from "randomstring"

dotenv.config()

const prefix = process.env.PREFIX ?? '/v1/api'
const username = randomstring.generate({
    length: 10,
    charset: 'alphabetic'
})
const user = {
    username,
    password: 'password123'
}

describe('Create User and Login', () => {
    it('Should create a new user', async () => {
        const res = await supertest(app)
            .post(`${prefix}/users`)
            .send(user)

        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
    })

    it('Should be able to login', async () => {
        const res = await supertest(app)
            .post(`${prefix}/users/login`)
            .send(user)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('access_token')
    })
})