import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Vendetta Roasting</title>
      </Head>
      <AdminLayout>
        <div>
          <h1 className="text-2xl font-semibold text-coffee-dark mb-6">Dashboard Overview</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Sales */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-coffee-light rounded-md p-3">
                    <svg className="h-6 w-6 text-cream-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                      <dd>
                        <div className="text-lg font-medium text-coffee-dark">$24,000</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/orders" className="font-medium text-coffee hover:text-coffee-light">
                    View all orders
                  </Link>
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-coffee-light rounded-md p-3">
                    <svg className="h-6 w-6 text-cream-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                      <dd>
                        <div className="text-lg font-medium text-coffee-dark">12</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/orders?status=pending" className="font-medium text-coffee hover:text-coffee-light">
                    View pending
                  </Link>
                </div>
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-coffee-light rounded-md p-3">
                    <svg className="h-6 w-6 text-cream-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                      <dd>
                        <div className="text-lg font-medium text-coffee-dark">248</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/customers" className="font-medium text-coffee hover:text-coffee-light">
                    View all customers
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Subscriptions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-coffee-light rounded-md p-3">
                    <svg className="h-6 w-6 text-cream-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Subscriptions</dt>
                      <dd>
                        <div className="text-lg font-medium text-coffee-dark">89</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/subscriptions" className="font-medium text-coffee hover:text-coffee-light">
                    View subscriptions
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-coffee-dark">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm text-coffee hover:text-coffee-light font-medium">
                  View all →
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: 'ORD-001', customer: 'John Smith', date: '2025-01-12', status: 'Processing', total: '$56.00' },
                    { id: 'ORD-002', customer: 'Sarah Johnson', date: '2025-01-12', status: 'Shipped', total: '$89.99' },
                    { id: 'ORD-003', customer: 'Michael Brown', date: '2025-01-11', status: 'Delivered', total: '$124.50' },
                    { id: 'ORD-004', customer: 'Emily Davis', date: '2025-01-11', status: 'Processing', total: '$42.75' },
                    { id: 'ORD-005', customer: 'David Wilson', date: '2025-01-10', status: 'Delivered', total: '$78.25' },
                  ].map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-coffee-dark">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/orders/${order.id}`} className="text-coffee hover:text-coffee-light">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

