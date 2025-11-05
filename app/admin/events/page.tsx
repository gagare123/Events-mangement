'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
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
  image?: string;
  createdAt: string;
}

interface Registration {
  _id: string;
  eventId: string;
  tickets: number;
  totalAmount: number;
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'registrations'>('date');

  const categories = [
    'all',
    'Technology',
    'Entertainment',
    'Business',
    'Education',
    'Sports',
    'Arts',
    'Health',
    'Food & Drink',
  ];

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

  useEffect(() => {
    filterAndSortEvents();
  }, [searchTerm, selectedCategory, sortBy, events, registrations]);

  const fetchData = async () => {
    try {
      const [eventsRes, regsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/registrations'),
      ]);

      const eventsData = await eventsRes.json();
      const regsData = await regsRes.json();

      setEvents(eventsData);
      setRegistrations(regsData);
      setFilteredEvents(eventsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    let filtered = [...events];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'registrations':
          const aRegs = registrations.filter((r) => r.eventId === a._id).length;
          const bRegs = registrations.filter((r) => r.eventId === b._id).length;
          return bRegs - aRegs;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter((e) => e._id !== id));
        alert('Event deleted successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const getEventStats = (eventId: string) => {
    const eventRegs = registrations.filter((r) => r.eventId === eventId);
    const totalRegistrations = eventRegs.length;
    const totalTickets = eventRegs.reduce((sum, r) => sum + r.tickets, 0);
    const totalRevenue = eventRegs.reduce((sum, r) => sum + r.totalAmount, 0);

    return { totalRegistrations, totalTickets, totalRevenue };
  };

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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">All Events</h1>
              <p className="text-xl text-purple-100">
                Manage and monitor all your events
              </p>
            </div>
            <Link
              href="/admin/events/create"
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              <Plus size={20} />
              Create Event
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 -mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Total Events</p>
            <p className="text-3xl font-bold text-purple-600">{events.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Upcoming Events</p>
            <p className="text-3xl font-bold text-green-600">
              {events.filter((e) => new Date(e.date) >= new Date()).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Past Events</p>
            <p className="text-3xl font-bold text-gray-600">
              {events.filter((e) => new Date(e.date) < new Date()).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Total Registrations</p>
            <p className="text-3xl font-bold text-blue-600">{registrations.length}</p>
          </div>
        </div>

        {/* Search, Filter, and Sort */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search events..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="registrations">Sort by Registrations</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 mb-6">
              {events.length === 0
                ? "You haven't created any events yet"
                : 'Try adjusting your search or filter criteria'}
            </p>
            {events.length === 0 && (
              <Link
                href="/admin/events/create"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                Create Your First Event
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const stats = getEventStats(event._id);
              const isPastEvent = new Date(event.date) < new Date();

              return (
                <div
                  key={event._id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                    isPastEvent ? 'opacity-75' : ''
                  }`}
                >
                  <div className="md:flex">
                    {/* Event Image */}
                    {event.image && (
                      <div className="md:w-64 md:flex-shrink-0">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Event Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {event.title}
                            </h3>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                              {event.category}
                            </span>
                            {isPastEvent && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                Past Event
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} className="text-gray-400" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} className="text-gray-400" />
                          <span>{event.capacity} capacity</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600">Registrations</p>
                          <p className="text-lg font-bold text-purple-600">
                            {stats.totalRegistrations}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Tickets Sold</p>
                          <p className="text-lg font-bold text-blue-600">
                            {stats.totalTickets}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Revenue</p>
                          <p className="text-lg font-bold text-green-600">
                            ₦{stats.totalRevenue.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Link
                          href={`/events/${event._id}`}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                        <Link
                          href={`/admin/events/edit/${event._id}`}
                          className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                        <div className="flex-1"></div>
                        <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                          <DollarSign size={16} />
                          ₦{event.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}