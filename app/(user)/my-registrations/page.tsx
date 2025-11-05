
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CheckCircle,
  XCircle,
  Eye,
  Download,
} from 'lucide-react';

interface Registration {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
  };
  name: string;
  email: string;
  phone: string;
  tickets: number;
  totalAmount: number;
  status: string;
  registeredAt: string;
}

export default function MyRegistrationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchRegistrations();
    }
  }, [status, router]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations');
      const data = await response.json();
      setRegistrations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      const response = await fetch(`/api/registrations?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistrations(registrations.filter((reg) => reg._id !== id));
        alert('Registration cancelled successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to cancel registration');
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration');
    }
  };

  const upcomingEvents = registrations.filter(
    (reg) => new Date(reg.eventId.date) >= new Date()
  );
  const pastEvents = registrations.filter(
    (reg) => new Date(reg.eventId.date) < new Date()
  );

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">My Registrations</h1>
          <p className="text-xl text-purple-100">
            View and manage your event registrations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-green-600">
                  {registrations.length}
                </p>
              </div>
              <Ticket className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Events</p>
                <p className="text-3xl font-bold text-green-600">
                  {upcomingEvents.length}
                </p>
              </div>
              <Calendar className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-green-600">
                  ₦
                  {registrations
                    .reduce((sum, reg) => sum + reg.totalAmount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <CheckCircle className="text-blue-600" size={40} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Past Events ({pastEvents.length})
              </button>
            </div>
          </div>
        </div>

        {/* No Registrations */}
        {registrations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Ticket className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Registrations Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring events and register for the ones you're interested in!
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Browse Events
            </Link>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events
            </h3>
            <p className="text-gray-600">
              You don't have any {activeTab === 'upcoming' ? 'upcoming' : 'past'}{' '}
              event registrations
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedEvents.map((registration) => (
              <div
                key={registration._id}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                  activeTab === 'past' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {registration.eventId.title}
                        </h3>
                        <div className="flex items-center gap-1 text-green-600 text-sm mb-2">
                          <CheckCircle size={16} />
                          <span className="font-medium capitalize">
                            {registration.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>
                          {new Date(registration.eventId.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{registration.eventId.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{registration.eventId.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket size={16} className="text-gray-400" />
                        <span>{registration.tickets} ticket(s)</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-xl font-bold text-green-600">
                            ₦{registration.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Registered On</p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(registration.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Link
                      href={`/events/${registration.eventId._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-900 transition-colors text-sm font-medium"
                    >
                      <Eye size={16} />
                      View Event
                    </Link>
                    {activeTab === 'upcoming' && (
                      <button
                        onClick={() => handleCancelRegistration(registration._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        <XCircle size={16} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


















