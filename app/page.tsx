'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, Ticket } from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     if (session?.user?.role === 'admin') {
  //       router.push('/admin/dashboard');
  //     } else {
  //       router.push('/dashboard');
  //     }
  //   }
  // }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
//bg-gradient-to-br from-pink-600 via-green-600 to-pink-400
  return (
    <div className="min-h-screen bg-green-50 ">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center text-black">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink bg-opacity-20 rounded-full mb-6">
            <Calendar className="text-black" size={48} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Gagare EventHub
          </h1>
          <p className="text-xl md:text-2xl text-green-500 mb-8 max-w-2xl mx-auto">
            Discover, register, and manage amazing events all in one place.
            Join thousands of event enthusiasts today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-black text-gray-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-black border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg w-fit mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Browse Events</h3>
            <p className="text-black">
              Discover a wide variety of events from technology conferences to entertainment shows.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg w-fit mb-4">
              <Ticket size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Registration</h3>
            <p className="text-green-500">
              Register for events in just a few clicks. Manage all your registrations in one place.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg w-fit mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">For Organizers</h3>
            <p className="text-blue-500">
              Create and manage events with powerful admin tools. Track registrations and revenue.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-green">
            <div>
              <p className="text-3xl text-green-500 font-bold mb-2">500+</p>
              <p className="text-pink-500">Events Created</p>
            </div>
            <div>
              <p className="text-3xl text-green-500 font-bold mb-2">10K+</p>
              <p className="text-pink-500">Attendees</p>
            </div>
            <div>
              <p className="text-3xl text-green-500 font-bold mb-2">50+</p>
              <p className="text-pink-500">Organizers</p>
            </div>
            <div>
              <p className="text-3xl text-green-500 font-bold mb-2">98%</p>
              <p className="text-pink-500">Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-500 mb-8">
            Join Gagare EventHub today and never miss an amazing event again.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-black text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}