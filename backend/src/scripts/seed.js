// Seed script to insert sample sweets
// Usage (PowerShell):
//   $env:MONGODB_URI="<your-mongo-uri>" ; node src/scripts/seed.js
// Defaults to mongodb://localhost:27017/sweetshop if MONGODB_URI is not set.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Sweet = require("../models/Sweet");
const connectDB = require("../config/database");

dotenv.config();

const seeds = [
  {
    name: "Dark Chocolate Truffle Box",
    category: "Chocolate",
    price: 24.5,
    quantity: 40,
    description: "Rich 70% cacao truffles with a hint of sea salt, boxed for gifting.",
    imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sea Salt Caramel Squares",
    category: "Toffee",
    price: 14.0,
    quantity: 55,
    description: "Slow-cooked butter caramels finished with flaky sea salt.",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Berry Gummy Stars",
    category: "Gummy",
    price: 9.5,
    quantity: 120,
    description: "Strawberry, raspberry, and blueberry gummies made with fruit juice.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Citrus Twist Lollipops",
    category: "Lollipop",
    price: 8.0,
    quantity: 90,
    description: "Small-batch lollies with lemon, orange, and grapefruit layers.",
    imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Honey Almond Nougat",
    category: "Candy",
    price: 12.75,
    quantity: 35,
    description: "Soft nougat with toasted almonds, honey, and vanilla bean.",
    imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Espresso Brittle Shards",
    category: "Hard Candy",
    price: 11.25,
    quantity: 60,
    description: "Coffee-infused brittle with roasted nuts and a dark crackly snap.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
];

async function run() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sweetshop";
    console.log("Connecting to", uri);
    await connectDB();

    // Remove any existing docs with same names to avoid duplicates on reruns
    await Sweet.deleteMany({ name: { $in: seeds.map((s) => s.name) } });
    const inserted = await Sweet.insertMany(seeds);
    console.log(`Seeded ${inserted.length} sweets.`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.connection.close();
  }
}

run();
