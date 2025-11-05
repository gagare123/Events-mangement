import mongoose from "mongoose";

async function testConnection() {
  const uri = process.env.MONGODB_URI || "your_connection_string_here";

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected successfully to MongoDB!");
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ MongoDB connection error:", err.message);
    } else {
      console.error("❌ MongoDB connection error:", err);
    }
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
