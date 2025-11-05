
'use client';

import { useState } from 'react';
import { X, Calendar, MapPin, DollarSign, Ticket, User, Mail, Phone } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  availableSeats?: number;
}

interface RegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegistrationModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const totalAmount = event.price * formData.tickets;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Register for Event</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Event Summary */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-bold text-gray-800 mb-3">{event.title}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-purple-600" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-purple-600" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-purple-600" />
                <span className="font-semibold text-green-600">
                  ₦{event.price.toLocaleString()} per ticket
                </span>
              </div>
              {event.availableSeats !== undefined && (
                <div className="flex items-center gap-2">
                  <Ticket size={14} className="text-purple-600" />
                  <span>{event.availableSeats} seats available</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <User size={16} />
                  Full Name *
                </span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  Email Address *
                </span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number *
                </span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+234 800 000 0000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Ticket size={16} />
                  Number of Tickets *
                </span>
              </label>
              <input
                type="number"
                min="1"
                max={event.availableSeats || 10}
                value={formData.tickets}
                onChange={(e) =>
                  setFormData({ ...formData, tickets: parseInt(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              {event.availableSeats && (
                <p className="text-xs text-gray-500 mt-1">
                  Maximum {Math.min(10, event.availableSeats)} tickets per registration
                </p>
              )}
            </div>

            {/* Total Amount */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="text-3xl font-bold text-green-600">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </form>

          {/* Info */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

