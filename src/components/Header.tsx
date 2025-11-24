import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';

// Global cart state
let globalSetIsCartOpen: ((value: boolean) => void) | null = null;

export function openCart() {
  if (globalSetIsCartOpen) {
    globalSetIsCartOpen(true);
  }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  // Set global cart opener
  useEffect(() => {
    globalSetIsCartOpen = setIsCartOpen;
    return () => {
      globalSetIsCartOpen = null;
    };
  }, []);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Fresh & Clean
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
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
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
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white justify-center font-semibold"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>View Cart ({cartCount})</span>
            </button>
          </nav>
        </div>
      )}
    </header>
    
    <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
