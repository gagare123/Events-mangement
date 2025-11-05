
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
} from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  category: string;
  price: number;
}

interface Registration {
  _id: string;
  eventId: string;
  name: string;
  email: string;
  tickets: number;
  totalAmount: number;
  status: string;
  registeredAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [eventsRes, regsRes, usersRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/registrations'),
        fetch('/api/admin/users'),
      ]);

      const [eventsData, regsData, usersData] = await Promise.all([
        eventsRes.json(),
        regsRes.json(),
        usersRes.json(),
      ]);

      setEvents(eventsData);
      setRegistrations(regsData);
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter((e) => e._id !== id));
        alert('Event deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleRoleChange = async (userId: string, action: 'promote' | 'demote') => {
    setUpdatingUser(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (!res.ok) throw new Error('Failed to update role');
      const updated = await res.json();

      setUsers(users.map((u) => (u._id === userId ? updated.user : u)));
      alert(`User ${action === 'promote' ? 'promoted to admin' : 'demoted to user'}`);
    } catch (error) {
      console.error(error);
      alert('Error updating role');
    } finally {
      setUpdatingUser(null);
    }
  };

  const totalRevenue = registrations.reduce((sum, reg) => sum + reg.totalAmount, 0);
  const totalTickets = registrations.reduce((sum, reg) => sum + reg.tickets, 0);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-green-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-black-600 mt-1">
              Welcome back, {session?.user?.name}
            </p>
          </div>
          <Link
            href="/admin/events/create"
            className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            Create Event
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Calendar className="text-blue-500" size={24} />}
            label="Total Events"
            value={events.length}
            growth="+12%"
          />
          <StatCard
            icon={<Users className="text-blue-600" size={24} />}
            label="Registrations"
            value={registrations.length}
            growth="+23%"
          />
          <StatCard
            icon={<DollarSign className="text-blue-600" size={24} />}
            label="Total Revenue"
            value={`₦${totalRevenue.toLocaleString()}`}
            growth="+18%"
          />
          <StatCard
            icon={<TrendingUp className="text-orange-600" size={24} />}
            label="Tickets Sold"
            value={totalTickets}
            growth="+8%"
          />
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Shield size={22} className="text-purple-600" />
              User Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-green-900 ">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-200">
                    <td className="px-4 py-3 text-black text-sm">{user.name}</td>
                    <td className="px-4 py-3 text-black text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-black text-sm">
                      <span
                        className={`inline-block px-2 py-1 text-sm rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {updatingUser === user._id ? (
                        <span className="text-sm text-gray-500">Updating...</span>
                      ) : user.role === 'user' ? (
                        <button
                          onClick={() => handleRoleChange(user._id, 'promote')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Promote to Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user._id, 'demote')}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Demote to User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="text-center text-gray-600 py-6">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  growth,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  growth: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
        <span className="text-green-600 text-sm font-medium">{growth}</span>
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}


