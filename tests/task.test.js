import request from "supertest";
import Task from "../src/models/Task.js";
import app from "../src/app.js";
import {
  authorizationHeader,
  setupDatabase,
  userTwo,
  taskOne,
} from "./fixtures/db.js";

beforeEach(setupDatabase);

test("Should create a task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set(...authorizationHeader)
    .send({ description: "Test Description" })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("Should fetch user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set(...authorizationHeader)
    .send()
    .expect(200);
  expect(response.body.length).toBe(2);
});

test("Should not delete other user tasks", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
