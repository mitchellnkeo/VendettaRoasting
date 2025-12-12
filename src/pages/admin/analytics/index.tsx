import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  revenueTrends: {
    daily: Array<{ date: string; revenue: number; orders: number }>;
    weekly: Array<{ week: string; revenue: number; orders: number }>;
    monthly: Array<{ month: string; revenue: number; orders: number }>;
  };
  topProducts: Array<{
    product_name: string;
    product_sku: string;
    total_quantity: number;
    total_revenue: number;
    order_count: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    repeatCustomers: number;
  };
  orderStatusBreakdown: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  averageOrderValue: {
    avg: number;
    min: number;
    max: number;
  };
  totals: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

const COLORS = ['#3a2618', '#6b4f3d', '#f0e6d9', '#f9f5f0', '#8b7355', '#a68b5b'];

export default function AdminAnalytics() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin, period, startDate, endDate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('period', period);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/admin/analytics?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        console.error('Failed to fetch analytics:', data.message);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (viewType === 'daily') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (viewType === 'weekly') {
      return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  const getRevenueData = () => {
    if (!analytics) return [];
    
    const data = analytics.revenueTrends[viewType];
    return data.map((item: any) => ({
      date: formatDate(item.date || item.week || item.month),
      revenue: parseFloat(item.revenue || '0'),
      orders: parseInt(item.orders || '0'),
    }));
  };

  if (isLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen-admin">
          <p className="text-coffee-dark">Loading analytics...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Analytics | Admin Dashboard | Vendetta Roasting</title>
      </Head>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-coffee-dark">Analytics Dashboard</h1>
            
            {/* Date Range Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Start:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">End:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                />
              </div>
              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  setStartDate('');
                  setEndDate('');
                }}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-coffee-light rounded-md p-3">
                    <svg className="h-6 w-6 text-cream-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-coffee-dark">
                        {analytics ? formatCurrency(analytics.totals.revenue) : '$0.00'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-coffee-light rounded-md p-3">
                    <svg className="h-6 w-6 text-cream-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-lg font-medium text-coffee-dark">
                        {analytics?.totals.orders || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-coffee-light rounded-md p-3">
                    <svg className="h-6 w-6 text-cream-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                      <dd className="text-lg font-medium text-coffee-dark">
                        {analytics ? formatCurrency(analytics.averageOrderValue.avg) : '$0.00'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-coffee-light rounded-md p-3">
                    <svg className="h-6 w-6 text-cream-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                      <dd className="text-lg font-medium text-coffee-dark">
                        {analytics?.totals.customers || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Trends Chart */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-coffee-dark">Revenue Trends</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewType('daily')}
                  className={`px-3 py-1 rounded text-sm ${
                    viewType === 'daily'
                      ? 'bg-coffee text-cream-light'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setViewType('weekly')}
                  className={`px-3 py-1 rounded text-sm ${
                    viewType === 'weekly'
                      ? 'bg-coffee text-cream-light'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setViewType('monthly')}
                  className={`px-3 py-1 rounded text-sm ${
                    viewType === 'monthly'
                      ? 'bg-coffee text-cream-light'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getRevenueData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  labelStyle={{ color: '#3a2618' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3a2618"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#6b4f3d"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Products */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-coffee-dark mb-4">Top Products</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.topProducts || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product_name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    labelStyle={{ color: '#3a2618' }}
                  />
                  <Legend />
                  <Bar dataKey="total_revenue" fill="#3a2618" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-coffee-dark mb-4">Order Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.orderStatusBreakdown || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => {
                      const status = entry.status || entry.payload?.status || '';
                      const percent = entry.percent || 0;
                      return `${status}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(analytics?.orderStatusBreakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Metrics */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-coffee-dark mb-4">Customer Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-coffee-light pl-4">
                <p className="text-sm text-gray-600">New Customers</p>
                <p className="text-2xl font-semibold text-coffee-dark">
                  {analytics?.customerMetrics.newCustomers || 0}
                </p>
              </div>
              <div className="border-l-4 border-coffee-light pl-4">
                <p className="text-sm text-gray-600">Repeat Customers</p>
                <p className="text-2xl font-semibold text-coffee-dark">
                  {analytics?.customerMetrics.repeatCustomers || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-coffee-dark">Top Selling Products</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                    analytics.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-coffee-dark">
                          {product.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.product_sku || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.total_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(product.total_revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.order_count}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No product data available
                      </td>
                    </tr>
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

