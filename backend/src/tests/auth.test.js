const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const User = require("../models/User");

// Test database connection
beforeAll(async () => {
  const testDbUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/sweetshop_test";
  await mongoose.connect(testDbUri);
});

// Clear database after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API Tests", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("token");
      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.isAdmin).toBe(false);
      expect(response.body).not.toHaveProperty("password");
    });

    it("should register an admin user", async () => {
      const userData = {
        username: "adminuser",
        email: "admin@example.com",
        password: "admin123",
        isAdmin: true,
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.isAdmin).toBe(true);
    });

    it("should fail with missing fields", async () => {
      const userData = {
        username: "testuser",
        // missing email and password
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("should reject password shorter than 8 characters", async () => {
      const userData = {
        username: "shortpass",
        email: "shortpass@example.com",
        password: "short",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain("at least 8 characters");
    });

    it("should fail with duplicate email", async () => {
      const userData = {
        username: "testuser1",
        email: "duplicate@example.com",
        password: "password123",
      };

      // Create first user
      await request(app).post("/api/auth/register").send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send({ ...userData, username: "testuser2" })
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });

    it("should fail with duplicate username", async () => {
      const userData = {
        username: "sameusername",
        email: "user1@example.com",
        password: "password123",
      };

      // Create first user
      await request(app).post("/api/auth/register").send(userData);

      // Try to create second user with same username
      const response = await request(app)
        .post("/api/auth/register")
        .send({ ...userData, email: "user2@example.com" })
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post("/api/auth/register").send({
        username: "logintest",
        email: "login@example.com",
        password: "password123",
      });
    });

    it("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body.email).toBe("login@example.com");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should fail with incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.message).toContain("Invalid");
    });

    it("should fail with non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "notexist@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body.message).toContain("Invalid");
    });

    it("should fail with missing credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      // Register and login to get token
      const response = await request(app).post("/api/auth/register").send({
        username: "metest",
        email: "me@example.com",
        password: "password123",
      });

      token = response.body.token;
    });

    it("should get current user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.email).toBe("me@example.com");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should fail without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body.message).toContain("Not authorized");
    });

    it("should fail with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken")
        .expect(401);

      expect(response.body.message).toContain("token failed");
    });
  });
});
