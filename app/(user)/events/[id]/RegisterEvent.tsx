"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function RegisterEvent({ eventId }: { eventId: string }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (status === "unauthenticated") {
      setError("Please login to register for this event.");
      return;
    }

    if (!session?.user) {
      setError("Session not found. Try refreshing.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ sends NextAuth cookie
        body: JSON.stringify({
          eventId,
          name: session.user.name,
          email: session.user.email,
          phone: "09000000000", // you can later add a real phone field in profile or form
          tickets: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccess("✅ Registered successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return null;

  return (
    <div className="mt-6">
      {status === "authenticated" ? (
        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register for this Event"}
        </button>
      ) : (
        <p className="text-gray-600">Please log in to register for this event.</p>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
