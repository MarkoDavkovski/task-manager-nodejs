import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import {
  authorizationHeader,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  PROFILE_PIC_PATH,
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  setupDatabase,
} from "./fixtures/db.js";

beforeEach(setupDatabase);

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
    password: TEST_USER_PASSWORD,
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
  expect(user.password).not.toBe(TEST_USER_PASSWORD);
});

test("Should login existing user", async () => {
  const response = await loginUser(TEST_USER_EMAIL, TEST_USER_PASSWORD);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
  const user = await User.findById(userOneId);
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
    .set(...authorizationHeader)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set(...authorizationHeader)
    .send()
    .expect(200);
  const deletedUser = await User.findById(userOneId);
  expect(deletedUser).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set(...authorizationHeader)
    .attach("avatar", PROFILE_PIC_PATH)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set(...authorizationHeader)
    .send({ name: "NoName" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("NoName");
});

test("Should not update valid user field", async () => {
  await request(app)
    .patch("/users/me")
    .set(...authorizationHeader)
    .send({ invalidProp: "NoData" })
    .expect(400);
});
