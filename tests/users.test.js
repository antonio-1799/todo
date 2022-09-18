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

describe('Create User, Login and Logout', () => {
    let token
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
        token = res.body.data.access_token

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('access_token')
    })

    it('Should be able to logout', async () => {
        const res = await supertest(app)
            .post(`${prefix}/users/logout`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
    })
})