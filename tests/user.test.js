import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "../src/config/config.js";

const testUserDataId = new mongoose.Types.ObjectId();
const testUserData = {
  _id: testUserDataId,
  name: "Jane Doe",
  email: "jane.doe@example.com",
  password: "Password1@3",
  tokens: [
    {
      token: jwt.sign({ _id: testUserDataId }, config.jwtSecretKey),
    },
  ],
};
const authorizationHeader = [
  "Authorization",
  `Bearer ${testUserData.tokens[0].token}`,
];

beforeEach(async () => {
  await User.deleteMany({});
  await new User(testUserData).save();
});

afterAll(async () => {
  await User.deleteMany({});
});

const signupUser = async (userData) => {
  return request(app).post("/users").send(userData);
};

const loginUser = async (email, password) => {
  return request(app).post("/users/login").send({ email, password });
};

test("Should signup a new user", async () => {
  const response = await signupUser({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "Password1@3",
  });
  expect(response.status).toBe(201);
  expect(response.body).toMatchObject({
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      _id: expect.any(String),
    },
    token: expect.any(String),
  });

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(user.password).not.toBe(testUserData.password);
});

test("Should login existing user", async () => {
  const response = await loginUser(testUserData.email, testUserData.password);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
  const user = await User.findById(testUserDataId);
  expect(user).not.toBeNull();
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login non-existent user", async () => {
  const response = await loginUser("invalid@example.com", "wrongPassword");
  expect(response.status).toBe(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${testUserData.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${testUserData.tokens[0].token}`)
    .send()
    .expect(200);
  const deletedUser = await User.findById(testUserDataId);
  expect(deletedUser).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${testUserData.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(testUserDataId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${testUserData.tokens[0].token}`)
    .send({ name: "NoName" })
    .expect(200);

  const user = await User.findById(testUserDataId);
  expect(user.name).toBe("NoName");
});

test("Should not update valid user field", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${testUserData.tokens[0].token}`)
    .send({ invalidProp: "NoData" })
    .expect(400);
});
