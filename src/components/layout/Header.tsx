import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import CartIcon from '../CartIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-cream-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-coffee-dark">Vendetta Roasting</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link href="/shop" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-coffee hover:text-coffee-dark">
              Shop
            </Link>
            <Link href="/subscriptions" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-coffee hover:text-coffee-dark">
              Subscriptions
            </Link>
            <Link href="/events" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-coffee hover:text-coffee-dark">
              Events
            </Link>
            <Link href="/faq" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-coffee hover:text-coffee-dark">
              FAQ
            </Link>
            <Link href="/wholesale" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-coffee hover:text-coffee-dark">
              Wholesale
            </Link>
            <Link href="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-coffee hover:text-coffee-dark">
              About
            </Link>
          </nav>

          {/* Cart and Account Links */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-coffee">
                  Welcome, {user?.firstName || 'User'}!
                </span>
                <div className="flex items-center space-x-2">
                  <Link href="/account/dashboard" className="text-sm text-coffee hover:text-coffee-dark">
                    Dashboard
                  </Link>
                  <span className="text-coffee">|</span>
                  <button 
                    onClick={logout}
                    className="text-sm text-coffee hover:text-coffee-dark"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="text-sm text-coffee hover:text-coffee-dark">
                  Sign In
                </Link>
                <span className="text-coffee">|</span>
                <Link href="/register" className="text-sm text-coffee hover:text-coffee-dark">
                  Register
                </Link>
              </div>
            )}
            <Link href="/account" className="p-2 text-coffee hover:text-coffee-dark">
              <span className="sr-only">Account</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <CartIcon />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-coffee hover:text-coffee-dark focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/shop" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
              Shop
            </Link>
            <Link href="/subscriptions" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
              Subscriptions
            </Link>
            <Link href="/events" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
              Events
            </Link>
            <Link href="/faq" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
              FAQ
            </Link>
            <Link href="/wholesale" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
              Wholesale
            </Link>
            <Link href="/about" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
              About
            </Link>
            <div className="border-t border-coffee-light pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="pl-3 pr-4 py-2 text-base font-medium text-coffee">
                    Welcome, {user?.firstName || 'User'}!
                  </div>
                  <Link href="/account/dashboard" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
                    Sign In
                  </Link>
                  <Link href="/register" className="block pl-3 pr-4 py-2 text-base font-medium text-coffee hover:bg-cream">
                    Register
                  </Link>
                </>
              )}
            </div>
            <div className="flex space-x-4 pl-3 pr-4 py-2">
              <Link href="/account" className="text-coffee hover:text-coffee-dark">
                <span className="sr-only">Account</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <CartIcon />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
