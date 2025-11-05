import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/app/lib/mongodb";
import Event from "@/app/models/Event";

// 🟢 GET: Fetch all events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().populate("createdBy", "name email");
    return NextResponse.json(events, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// 🟣 POST: Create new event
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await req.json();

    // ✅ Parse and sanitize numeric values first
    const capacity = Number(data.capacity);
    const availableSeats = Number(data.availableSeats || data.capacity);
    const price = Number(data.price);

    // ✅ Validate all required fields
    if (
      !data.title ||
      !data.description ||
      !data.date ||
      !data.time ||
      !data.location ||
      !data.category
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Validate numeric fields
    if (
      isNaN(price) ||
      isNaN(capacity) ||
      isNaN(availableSeats) ||
      capacity < 1
    ) {
      return NextResponse.json(
        { error: "Price or seats must be valid numbers" },
        { status: 400 }
      );
    }

    // ✅ Create new event safely
    const event = await Event.create({
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      time: data.time,
      location: data.location,
      category: data.category,
      capacity,
      availableSeats,
      price,
      image: data.image || "",
      createdBy: session.user.id,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating event:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}

