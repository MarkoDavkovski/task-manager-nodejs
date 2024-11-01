import mongoose from "mongoose";
import config from "../../src/config/config.js";
import jwt from "jsonwebtoken";
import User from "../../src/models/User.js";
import Task from "../../src/models/Task.js";

const TEST_USER_EMAIL = "jane.doe@example.com";
const TEST_USER_PASSWORD = "Password1@3";
const PROFILE_PIC_PATH = "tests/fixtures/profile-pic.jpg";

const generateUserIdAndToken = (userId) => ({
  _id: userId,
  token: jwt.sign({ _id: userId }, config.jwtSecretKey),
});

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Jane Doe",
  email: TEST_USER_EMAIL,
  password: TEST_USER_PASSWORD,
  tokens: [generateUserIdAndToken(userOneId)],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "John Smith",
  email: "john.smith@example.com",
  password: "Password!23",
  tokens: [generateUserIdAndToken(userTwoId)],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task 1",
  completed: false,
  owner: userOneId,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task 2",
  completed: true,
  owner: userOneId,
};
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task 3",
  completed: true,
  owner: userTwoId,
};

// Authorization Headers for Requests
const authorizationHeader = [
  "Authorization",
  `Bearer ${userOne.tokens[0].token}`,
];

// Set up the database before each test
const setupDatabase = async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

export {
  authorizationHeader,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  PROFILE_PIC_PATH,
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
