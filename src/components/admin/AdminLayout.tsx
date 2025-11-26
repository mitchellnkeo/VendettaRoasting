import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Products', href: '/admin/products', icon: '☕' },
    { name: 'Customers', href: '/admin/customers', icon: '👥' },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: '🔄' },
    { name: 'Reviews', href: '/admin/reviews', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-coffee-dark text-cream-light">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-coffee-light">
            <Link href="/admin" className="text-xl font-bold">
              Vendetta Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href || 
                (item.href !== '/admin' && router.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-coffee text-cream-light'
                      : 'text-cream hover:bg-coffee-light hover:text-cream-light'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-coffee-light p-4">
            <div className="mb-3">
              <p className="text-sm text-cream-light">Logged in as</p>
              <p className="font-medium">{user?.email || 'Admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-coffee hover:bg-coffee-light text-cream-light rounded-lg transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-coffee-dark">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-coffee hover:text-coffee-light text-sm font-medium"
              >
                View Site →
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

