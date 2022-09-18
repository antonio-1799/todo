import express from "express";
import cors from "cors";
import * as dotenv from 'dotenv'
import baseRouter from "./routes/BaseRouter.js";

dotenv.config()

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(process.env.PREFIX || '/v1/api', baseRouter);

export default app