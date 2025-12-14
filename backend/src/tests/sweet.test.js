const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Sweet = require("../models/Sweet");

let userToken;
let adminToken;
let sweetId;
let existingSweetId;

// Test database connection
beforeAll(async () => {
  const testDbUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/sweetshop_test";
  await mongoose.connect(testDbUri);

  // Create regular user
  const userResponse = await request(app).post("/api/auth/register").send({
    username: "regularuser",
    email: "user@example.com",
    password: "password123",
  });
  userToken = userResponse.body.token;

  // Create admin user
  const adminResponse = await request(app).post("/api/auth/register").send({
    username: "adminuser",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  });
  adminToken = adminResponse.body.token;
});

// Clear sweets after each test
afterEach(async () => {
  await Sweet.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Sweet API Tests", () => {
  describe("POST /api/sweets", () => {
    it("should create a new sweet as admin", async () => {
      const sweetData = {
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.99,
        quantity: 100,
        description: "Delicious chocolate bar",
      };

      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.name).toBe(sweetData.name);
      expect(response.body.category).toBe(sweetData.category);
      expect(response.body.price).toBe(sweetData.price);
      expect(response.body.quantity).toBe(sweetData.quantity);
      expect(response.body).toHaveProperty("_id");
      sweetId = response.body._id;
    });

    it("should fail to create sweet as non-admin user", async () => {
      const sweetData = {
        name: "Gummy Bears",
        category: "Gummy",
        price: 1.99,
        quantity: 50,
      };

      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);
    });

    it("should fail to create sweet without authentication", async () => {
      const sweetData = {
        name: "Lollipop",
        category: "Lollipop",
        price: 0.99,
        quantity: 200,
      };

      await request(app).post("/api/sweets").send(sweetData).expect(401);
    });

    it("should fail with missing required fields", async () => {
      const sweetData = {
        name: "Incomplete Sweet",
        // missing category, price, quantity
      };

      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/sweets", () => {
    beforeEach(async () => {
      // Create test sweets
      await Sweet.create([
        {
          name: "Milk Chocolate",
          category: "Chocolate",
          price: 3.99,
          quantity: 50,
        },
        {
          name: "Gummy Worms",
          category: "Gummy",
          price: 2.49,
          quantity: 75,
        },
        {
          name: "Hard Candy Mix",
          category: "Hard Candy",
          price: 1.99,
          quantity: 100,
        },
      ]);
    });

    it("should get all sweets with authentication", async () => {
      const response = await request(app)
        .get("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it("should fail without authentication", async () => {
      await request(app).get("/api/sweets").expect(401);
    });
  });

  describe("GET /api/sweets/search", () => {
    beforeEach(async () => {
      await Sweet.create([
        {
          name: "Dark Chocolate",
          category: "Chocolate",
          price: 4.2,
          quantity: 30,
        },
        {
          name: "White Chocolate",
          category: "Chocolate",
          price: 3.99,
          quantity: 40,
        },
        {
          name: "Sour Gummy",
          category: "Gummy",
          price: 2.99,
          quantity: 60,
        },
      ]);
    });

    it("should search sweets by name", async () => {
      const response = await request(app)
        .get("/api/sweets/search?name=chocolate")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toContain("Chocolate");
    });

    it("should filter sweets by category", async () => {
      const response = await request(app)
        .get("/api/sweets/search?category=Gummy")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].category).toBe("Gummy");
    });

    it("should filter sweets by price range", async () => {
      const response = await request(app)
        .get("/api/sweets/search?minPrice=3&maxPrice=4.5")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.length).toBe(2);
      response.body.forEach((sweet) => {
        expect(sweet.price).toBeGreaterThanOrEqual(3);
        expect(sweet.price).toBeLessThanOrEqual(4.5);
      });
    });

    it("should combine multiple search filters", async () => {
      const response = await request(app)
        .get("/api/sweets/search?category=Chocolate&maxPrice=4")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe("White Chocolate");
    });
  });

  describe("PUT /api/sweets/:id", () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Original Sweet",
        category: "Candy",
        price: 1.99,
        quantity: 50,
      });
      sweetId = sweet._id;
    });

    it("should update sweet as admin", async () => {
      const updateData = {
        name: "Updated Sweet",
        price: 2.99,
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.category).toBe("Candy"); // unchanged
    });

    it("should fail to update sweet as non-admin", async () => {
      const updateData = {
        name: "Unauthorized Update",
      };

      await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);
    });

    it("should return 404 for non-existent sweet", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test" })
        .expect(404);
    });
  });

  describe("DELETE /api/sweets/:id", () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Sweet to Delete",
        category: "Candy",
        price: 1.49,
        quantity: 25,
      });
      sweetId = sweet._id;
    });

    it("should delete sweet as admin", async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toContain("removed");

      // Verify sweet is deleted
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it("should fail to delete sweet as non-admin", async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });

    it("should return 404 for non-existent sweet", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe("POST /api/sweets/:id/purchase", () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Sweet to Purchase",
        category: "Candy",
        price: 0.99,
        quantity: 10,
      });
      sweetId = sweet._id;
    });

    it("should purchase sweet with sufficient stock", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 3 })
        .expect(200);

      expect(response.body.message).toContain("successful");
      expect(response.body.sweet.quantity).toBe(7);
    });

    it("should fail with insufficient stock", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 15 })
        .expect(400);

      expect(response.body.message).toContain("Insufficient stock");
    });

    it("should fail with invalid quantity", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 0 })
        .expect(400);

      expect(response.body.message).toContain("Invalid quantity");
    });

    it("should fail for non-existent sweet", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 1 })
        .expect(404);
    });
  });

  describe("POST /api/sweets/:id/restock", () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Sweet to Restock",
        category: "Candy",
        price: 1.29,
        quantity: 5,
      });
      sweetId = sweet._id;
    });

    it("should restock sweet as admin", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 20 })
        .expect(200);

      expect(response.body.message).toContain("successful");
      expect(response.body.sweet.quantity).toBe(25);
    });

    it("should fail to restock as non-admin", async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(403);
    });

    it("should fail with invalid quantity", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: -5 })
        .expect(400);

      expect(response.body.message).toContain("Invalid quantity");
    });

    it("should fail for non-existent sweet", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .post(`/api/sweets/${fakeId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 5 })
        .expect(404);
    });
  });

  describe("GET /api/sweets/:id", () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Detail Sweet",
        category: "Candy",
        price: 2.5,
        quantity: 20,
      });
      existingSweetId = sweet._id;
    });

    it("should return sweet details with authentication", async () => {
      const response = await request(app)
        .get(`/api/sweets/${existingSweetId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body._id).toBe(String(existingSweetId));
      expect(response.body.name).toBe("Detail Sweet");
    });

    it("should fail without authentication", async () => {
      await request(app).get(`/api/sweets/${existingSweetId}`).expect(401);
    });

    it("should return 404 for missing sweet", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .get(`/api/sweets/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });
  });
});
