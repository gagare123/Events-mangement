import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    const { email, action } = await req.json();

    if (!email || !["promote", "demote"].includes(action)) {
      return NextResponse.json(
        { error: "Email and valid action are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "promote" && user.role === "admin") {
      return NextResponse.json({ message: "User is already an admin" });
    }

    if (action === "demote" && user.role === "user") {
      return NextResponse.json({ message: "User is already a regular user" });
    }

    user.role = action === "promote" ? "admin" : "user";
    await user.save();

    return NextResponse.json({
      message:
        action === "promote"
          ? `${user.name || email} promoted to admin successfully!`
          : `${user.name || email} demoted to regular user successfully!`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
