import express from "express";
import connectDB from "./db/mongoose.js";
import UserRouter from "./routers/user.js";
import TaskRouter from "./routers/task.js";

connectDB();

const app = express();

app.use(express.json());

app.use(UserRouter, TaskRouter);

export default app;
