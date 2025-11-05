"use client";

import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserRoleManager() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/users/all");
      const data = await res.json();
      setUsers(data);
    } catch {
      setMessage("Failed to load users.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (email: string, action: "promote" | "demote") => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action }),
      });
      const data = await res.json();
      setMessage(data.message || data.error || "Something went wrong.");
      fetchUsers();
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-12">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        User Role Management
      </h2>
      <p className="text-gray-600 mb-4">
        View all users and manage their roles easily.
      </p>

      {message && (
        <div className="mb-4 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded border">
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Role
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Joined
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{user.name || "N/A"}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {user.role === "user" ? (
                    <button
                      onClick={() => handleAction(user.email, "promote")}
                      disabled={loading}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                    >
                      Promote
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(user.email, "demote")}
                      disabled={loading}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                    >
                      Demote
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-center text-gray-500 py-6">No users found.</p>
      )}
    </div>
  );
}
