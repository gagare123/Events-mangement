
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/app/lib/mongodb";
import Registration from "@/app/models/Registration";
import Event from "@/app/models/Event";

/* ===========================
   ✅ CREATE NEW REGISTRATION
   =========================== */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { eventId, phone, tickets = 1 } = body;

    if (!eventId || !phone)
      return NextResponse.json(
        { error: "Event ID and phone number are required" },
        { status: 400 }
      );

    const parsedTickets = Number(tickets);
    if (isNaN(parsedTickets) || parsedTickets <= 0)
      return NextResponse.json(
        { error: "Tickets must be a valid positive number" },
        { status: 400 }
      );

    const event = await Event.findById(eventId);
    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const existing = await Registration.findOne({
      eventId,
      userId: session.user.id,
    });
    if (existing)
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 }
      );

    const registrations = await Registration.find({ eventId });
    const totalTicketsSold = registrations.reduce(
      (sum, r) => sum + (r.tickets || 0),
      0
    );
    const availableSeats = event.capacity - totalTicketsSold;

    if (availableSeats < parsedTickets)
      return NextResponse.json(
        { error: `Only ${availableSeats} seats left` },
        { status: 400 }
      );

    const totalAmount = Number(event.price) * parsedTickets;

    const registration = await Registration.create({
      userId: session.user.id,
      eventId: event._id,
      name: session.user.name || "Guest",
      email: session.user.email || "",
      phone,
      tickets: parsedTickets,
      totalAmount,
      registeredAt: new Date(),
      status: "confirmed",
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating registration:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create registration" },
      { status: 500 }
    );
  }
}

/* ===========================
   ✅ GET USER REGISTRATIONS
   =========================== */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const registrations = await Registration.find({ userId: session.user.id })
      .populate("eventId")
      .sort({ registeredAt: -1 });

    return NextResponse.json(registrations, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching registrations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

/* ===========================
   ✅ DELETE REGISTRATION
   =========================== */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });

    await connectDB();

    const registration = await Registration.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!registration)
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });

    return NextResponse.json({ message: "Registration deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error deleting registration:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete registration" },
      { status: 500 }
    );
  }
}

