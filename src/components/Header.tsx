import { Link, useLocation } from 'react-router-dom';
import { Calendar, CreditCard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Sparkling Bubble
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Pricing
          </a>
          <a href="/#bundles" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Bundles
          </a>
          <a href="/#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            How It Works
          </a>
          <a href="/#faq" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            FAQ
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/book"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg transition-all font-semibold"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Now</span>
          </Link>
          <Link
            to="/pay"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors font-semibold"
          >
            <CreditCard className="w-5 h-5" />
            <span>Pay</span>
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4">
          <nav className="flex flex-col gap-4">
            <a href="/#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </a>
            <a href="/#bundles" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Bundles
            </a>
            <a href="/#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              How It Works
            </a>
            <a href="/#faq" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              FAQ
            </a>
            <Link
              to="/book"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white justify-center font-semibold"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Now</span>
            </Link>
            <Link
              to="/pay"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white justify-center font-semibold"
            >
              <CreditCard className="w-5 h-5" />
              <span>Pay</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
