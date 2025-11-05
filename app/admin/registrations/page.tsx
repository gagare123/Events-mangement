'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, Download, Search, Filter } from 'lucide-react';

interface Registration {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    date: string;
    time: string;
  };
  userId: {
    name: string;
    email: string;
  };
  name: string;
  email: string;
  phone: string;
  tickets: number;
  totalAmount: number;
  status: string;
  registeredAt: string;
}

export default function AdminRegistrationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegs, setFilteredRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchRegistrations();
  }, [status, session, router]);

  useEffect(() => {
    filterRegistrations();
  }, [searchTerm, statusFilter, registrations]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations');
      const data = await response.json();
      setRegistrations(data);
      setFilteredRegs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = registrations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.eventId.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRegs(filtered);
  };

  const totalRevenue = registrations.reduce((sum, reg) => sum + reg.totalAmount, 0);
  const totalTickets = registrations.reduce((sum, reg) => sum + reg.tickets, 0);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-900 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">All Registrations</h1>
          <p className="text-xl text-purple-100">
            Manage and track all event registrations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-purple-600">
                  {registrations.length}
                </p>
              </div>
              <Users className="text-purple-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  ₦{totalRevenue.toLocaleString()}
                </p>
              </div>
              <Calendar className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tickets Sold</p>
                <p className="text-3xl font-bold text-blue-600">{totalTickets}</p>
              </div>
              <Download className="text-blue-600" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-00">
                    Attendee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Tickets
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRegs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegs.map((reg) => (
                    <tr key={reg._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{reg.name}</p>
                          <p className="text-sm text-gray-600">{reg.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {reg.eventId.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(reg.eventId.date).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reg.phone}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {reg.tickets}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        ₦{reg.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            reg.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : reg.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}