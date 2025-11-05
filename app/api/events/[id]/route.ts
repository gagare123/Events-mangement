import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/Event';
import Registration from '@/app/models/Registration';

// GET single event
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const event = await Event.findById(id).populate('createdBy', 'name email');
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const registrationCount = await Registration.countDocuments({ eventId: id });
    const availableSeats = event.capacity - registrationCount;

    return NextResponse.json(
      {
        ...event.toObject(),
        registrationCount,
        availableSeats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update event (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const event = await Event.findById(id);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    Object.assign(event, body);
    await event.save();

    return NextResponse.json(event, { status: 200 });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE event (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const event = await Event.findById(id);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const registrationCount = await Registration.countDocuments({ eventId: id });
    if (registrationCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete event with existing registrations' },
        { status: 400 }
      );
    }

    await Event.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event', details: error.message },
      { status: 500 }
    );
  }
}









