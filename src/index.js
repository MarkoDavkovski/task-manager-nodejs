import express from "express";
import connectDB from "./db/mongoose.js";
import UserRouter from "./routers/user.js";
import TaskRouter from "./routers/task.js";

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(UserRouter, TaskRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
