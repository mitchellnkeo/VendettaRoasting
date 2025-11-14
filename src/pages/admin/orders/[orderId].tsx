import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth/AuthContext';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  shipping_address: any;
  billing_address: any;
  notes: string;
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
}

export default function AdminOrderDetail() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    payment_status: '',
    notes: '',
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  useEffect(() => {
    if (orderId && isAdmin) {
      fetchOrder();
    }
  }, [orderId, isAdmin]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
        setStatusUpdate({
          status: data.data.status,
          payment_status: data.data.payment_status,
          notes: data.data.notes || '',
        });
      } else {
        console.error('Failed to fetch order:', data.message);
        setOrder(null);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusUpdate),
      });

      const data = await response.json();
      if (data.success) {
        await fetchOrder();
        alert('Order updated successfully');
      } else {
        alert(data.message || 'Error updating order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Loading...</div>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Order not found</p>
          <Link href="/admin/orders" className="text-coffee hover:text-coffee-light mt-4 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Order {order.order_number} | Admin | Vendetta Roasting</title>
      </Head>
      <AdminLayout>
        <div>
          <div className="mb-6">
            <Link href="/admin/orders" className="text-coffee hover:text-coffee-light mb-4 inline-block">
              ← Back to Orders
            </Link>
            <h1 className="text-2xl font-semibold text-coffee-dark mt-2">
              Order {order.order_number}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-4">
                      <div>
                        <p className="font-medium text-coffee-dark">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-coffee-dark">
                          ${parseFloat(item.unit_price.toString()).toFixed(2)} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${parseFloat(item.total_price.toString()).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${parseFloat(order.subtotal.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${parseFloat(order.tax_amount.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">${parseFloat(order.shipping_amount.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-coffee-dark pt-2 border-t">
                    <span>Total:</span>
                    <span>${parseFloat(order.total_amount.toString()).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Customer Information</h2>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {order.customer_name || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {order.customer_email || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {order.customer_phone || 'N/A'}</p>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-coffee-dark mb-4">Shipping Address</h2>
                  <div className="text-sm text-gray-600">
                    {typeof order.shipping_address === 'string' ? (
                      <pre className="whitespace-pre-wrap">{order.shipping_address}</pre>
                    ) : (
                      <div>
                        <p>{order.shipping_address.street}</p>
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                        </p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status Update Panel */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Update Order Status</h2>
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coffee focus:ring-coffee"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={statusUpdate.payment_status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, payment_status: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coffee focus:ring-coffee"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      value={statusUpdate.notes}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coffee focus:ring-coffee"
                      placeholder="Add internal notes about this order..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-coffee hover:bg-coffee-light text-cream-light px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Update Order'}
                  </button>
                </form>
              </div>

              {/* Order Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Order Information</h2>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Order Number:</span> {order.order_number}</p>
                  <p><span className="font-medium">Created:</span> {new Date(order.created_at).toLocaleString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(order.updated_at).toLocaleString()}</p>
                  {order.shipped_at && (
                    <p><span className="font-medium">Shipped:</span> {new Date(order.shipped_at).toLocaleString()}</p>
                  )}
                  {order.delivered_at && (
                    <p><span className="font-medium">Delivered:</span> {new Date(order.delivered_at).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

