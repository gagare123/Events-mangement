import connectDB from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'MongoDB connected successfully!' });
  } catch (err) {
    return NextResponse.json({ status: 'MongoDB connection failed', error: err });
  }
}
