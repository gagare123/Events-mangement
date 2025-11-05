'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Tag, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    category: '',
    price: '',
    image: '',
  });

  const categories = [
    'Technology',
    'Entertainment',
    'Business',
    'Education',
    'Sports',
    'Arts',
    'Health',
    'Food & Drink',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      alert('Event created successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-green-900 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-white-900 hover:text-purple-700 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Create New Event</h1>
          <p className="text-white-600 mt-1">
            Fill in the details below to create a new event
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  Event Title *
                </span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Annual Tech Conference 2025"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 text-black py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your event in detail..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide a detailed description of what attendees can expect
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <span className="flex items-center gap-2 text-black">
                    <Calendar size={16} />
                    Event Date *
                  </span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    Event Time *
                  </span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  Location *
                </span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Lagos Convention Center, Victoria Island"
                required
              />
            </div>

            {/* Capacity and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Users size={16} />
                    Capacity *
                  </span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum number of attendees
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Tag size={16} />
                    Category *
                  </span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <DollarSign size={16} />
                  Ticket Price (₦) *
                </span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 25000"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Price per ticket in Nigerian Naira
              </p>
            </div>

            {/* Image URL (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <ImageIcon size={16} />
                  Event Image URL (Optional)
                </span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide a URL to an image for your event (recommended size: 1200x630)
              </p>
            </div>
          </div>

          {/* Preview */}
          {formData.title && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className="bg-white rounded-lg p-4">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-bold text-gray-800 flex-1">
                    {formData.title}
                  </h4>
                  {formData.category && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full ml-2">
                      {formData.category}
                    </span>
                  )}
                </div>
                {formData.description && (
                  <p className="text-gray-600 text-sm mb-3">{formData.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {formData.date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(formData.date).toLocaleDateString()}
                    </span>
                  )}
                  {formData.time && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formData.time}
                    </span>
                  )}
                  {formData.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {formData.location}
                    </span>
                  )}
                  {formData.capacity && (
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {formData.capacity} capacity
                    </span>
                  )}
                </div>
                {formData.price && (
                  <p className="mt-3 text-xl font-bold text-green-600">
                    ₦{parseFloat(formData.price).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-8 border border-red-500 text-gray-700 py-3 rounded-lg font-semibold hover:bg-red-500 transition-colors text-center flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}