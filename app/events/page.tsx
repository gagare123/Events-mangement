"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  capacity: number;
  availableSeats: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin mr-2" />
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        <p>❌ {error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Events</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {event.title}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>
            <p className="text-gray-600 line-clamp-2 mb-3">
              {event.description}
            </p>
            <p className="text-gray-700 font-medium mb-1">
              📍 {event.location}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              Category: {event.category}
            </p>
            <div className="flex justify-between items-center mt-4">
              <p className="font-semibold text-blue-600">
                ₦{event.price.toLocaleString()}
              </p>
              <Link
                href={`/events/${event._id}`}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
