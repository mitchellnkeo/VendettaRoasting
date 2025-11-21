import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth/AuthContext';

interface SubscriptionItem {
  id: string;
  product_name: string;
  quantity: number;
}

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  status: string;
  plan_name: string;
  plan_price: number;
  frequency: string;
  next_delivery_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  customer_email: string;
  customer_name: string;
  items: SubscriptionItem[];
}

export default function AdminSubscriptions() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchSubscriptions();
    }
  }, [isAdmin, selectedStatus]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/admin/subscriptions?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSubscriptions(data.data || []);
      } else {
        console.error('Failed to fetch subscriptions:', data.message);
        setSubscriptions([]);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      past_due: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen-admin">
          <p className="text-coffee-dark">Loading admin panel...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Redirect handled by useEffect
  }

  return (
    <>
      <Head>
        <title>Subscriptions | Admin - Vendetta Roasting</title>
      </Head>
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-coffee-dark">Subscription Management</h1>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Delivery
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Loading subscriptions...
                      </td>
                    </tr>
                  ) : subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        {selectedStatus !== 'all'
                          ? `No subscriptions with status "${selectedStatus}" found`
                          : 'No subscriptions found'}
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((subscription) => (
                      <tr key={subscription.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-coffee-dark">
                            {subscription.customer_name || 'Guest'}
                          </div>
                          <div className="text-sm text-gray-500">{subscription.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subscription.plan_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subscription.next_delivery_date
                            ? new Date(subscription.next_delivery_date).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-coffee-dark">
                          ${parseFloat(subscription.plan_price.toString()).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              subscription.status
                            )}`}
                          >
                            {subscription.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

