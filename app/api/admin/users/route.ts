import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

// 🔑 Protect admin routes
async function verifyAdmin(req: Request) {
  const token = await getToken({ req });
  if (!token) {
    return { authorized: false, status: 401, message: 'Unauthorized' };
  }

  if (token.role !== 'admin') {
    return { authorized: false, status: 403, message: 'Forbidden: Admins only' };
  }

  return { authorized: true, token };
}

// 📍 GET → Fetch all users
export async function GET(req: Request) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    await connectDB();
    const users = await User.find({}, 'name email role').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// 📍 PUT → Promote or demote user
export async function PUT(req: Request) {
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    await connectDB();
    const { userId, action } = await req.json();

    if (!userId || !['promote', 'demote'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.role = action === 'promote' ? 'admin' : 'user';
    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
