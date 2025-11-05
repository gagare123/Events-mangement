// test-db.js
require("dotenv").config(); // loads .env or .env.local
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

async function testConnection() {
  try {
    if (!uri) throw new Error("MONGODB_URI not found in environment variables");

    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ Connected successfully to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();







// import connectDB from './app/lib/mongodb'; // correct relative path

// async function test() {
//   try {
//     await connectDB();
//     console.log('MongoDB connected successfully!');
//   } catch (err) {
//     console.error('MongoDB connection failed:', err);
//   }
// }

// test();
