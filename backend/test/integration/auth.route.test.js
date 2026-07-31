import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

import app from "../../src/app.js";
import { connectDB } from "../../src/lib/db.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await connectDB();
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const user = {
  fullName: "Test User",
  email: "test@example.com",
  password: "password123",
};

describe("POST /api/auth/signup", () => {
  test("creates a user and sets a session cookie", async () => {
    const res = await request(app).post("/api/auth/signup").send(user);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(user.email);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("rejects a duplicate email", async () => {
    await request(app).post("/api/auth/signup").send(user);
    const res = await request(app).post("/api/auth/signup").send(user);

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  test("authenticates an existing user", async () => {
    await request(app).post("/api/auth/signup").send(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(user.email);
  });

  test("rejects invalid credentials", async () => {
    await request(app).post("/api/auth/signup").send(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "wrongpassword" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/check", () => {
  test("rejects a request without a session cookie", async () => {
    const res = await request(app).get("/api/auth/check");
    expect(res.status).toBe(401);
  });

  test("returns the user for an authenticated session", async () => {
    const signupRes = await request(app).post("/api/auth/signup").send(user);
    const cookies = signupRes.headers["set-cookie"];

    const res = await request(app)
      .get("/api/auth/check")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
  });
});
