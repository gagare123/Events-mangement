
"use client";

import { useState } from "react";

export default function EventCard({ event }: { event: any }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState("");
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!phone) {
      alert("Please enter your phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          phone,
          tickets,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Registration failed.");
      } else {
        alert("✅ Registered successfully!");
        setIsRegistering(false);
        setPhone("");
        setTickets(1);
      }
    } catch (err) {
      console.error("❌ Error registering:", err);
      alert("Error registering for this event.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white mb-4">
      <h2 className="text-lg font-semibold">{event.title}</h2>
      <p className="text-gray-600 mt-1">{event.description}</p>
      <p className="mt-2">
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Time:</strong> {event.time}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p className="mt-2 font-medium text-green-600">
        ₦{event.price?.toLocaleString()}
      </p>

      {!isRegistering ? (
        <button
          onClick={() => setIsRegistering(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            min={1}
            value={tickets}
            onChange={(e) => setTickets(parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {loading ? "Registering..." : "Confirm"}
            </button>
            <button
              onClick={() => setIsRegistering(false)}
              className="flex-1 bg-red-500 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}





