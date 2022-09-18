import express from "express";
import cors from "cors";
import db from "./src/libs/db.js";
import * as dotenv from 'dotenv'
import baseRouter from "./src/routes/BaseRouter.js";

dotenv.config()

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    await db.sync()
    console.log('Syncing database models')
} catch (error) {
    console.error('Unable to connect to the database:', error.message);
}

app.use(process.env.PREFIX || '/v1/api', baseRouter);

const port = process.env.HOST_PORT || 5000
app.listen(port, () => console.log(`Server running at port ${port}`));