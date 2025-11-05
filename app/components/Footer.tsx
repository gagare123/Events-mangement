import Link from 'next/link';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Calendar className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white">EventHub</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your one-stop platform for discovering, organizing, and managing amazing events. Join thousands of event enthusiasts today!
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/my-registrations" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  My Registrations
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Event Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard?category=Technology" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/dashboard?category=Entertainment" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/dashboard?category=Business" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/dashboard?category=Education" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/dashboard?category=Sports" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Sports & Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm">
                  123 Event Street, Victoria Island, Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-purple-400 flex-shrink-0" />
                <a href="tel:+2348000000000" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-purple-400 flex-shrink-0" />
                <a href="mailto:info@eventhub.com" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  info@eventhub.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                />
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EventHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

