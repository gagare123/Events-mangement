import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST() {
  try {
    await connectDB();

    // 🔍 Replace this with your email
    const email = "lukmangagare@gmail.com";

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.role = "admin";
    await user.save();

    return NextResponse.json({ message: `✅ ${email} is now an admin.` });
  } catch (error) {
    console.error("Seed admin error:", error);
    return NextResponse.json({ error: "Failed to promote user" }, { status: 500 });
  }
}
