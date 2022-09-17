// Import express
import express from "express";
import cors from "cors";
import db from "../config/db.js";
import router from "./routes/todos-routes.js";
import * as dotenv from 'dotenv'
import baseRouter from "./routes/base-route.js";

// Get environment variables
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.use(process.env.PREFIX || '/v1/api', baseRouter);

const port = process.env.HOST_PORT || 5000
app.listen(port, () => console.log(`Server running at port ${port}`));