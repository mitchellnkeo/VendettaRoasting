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
  const [sendingReviewRequest, setSendingReviewRequest] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    payment_status: '',
    notes: '',
    tracking_number: '',
    tracking_url: '',
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const fetchOrder = async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      // Decode orderId if it's URL encoded, then encode for the API call
      const decodedId = decodeURIComponent(orderId as string);
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(decodedId)}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
        // Extract tracking info from notes if present
        const notes = data.data.notes || '';
        const trackingMatch = notes.match(/Tracking Number:\s*([^\n]+)/);
        const trackingUrlMatch = notes.match(/Tracking URL:\s*([^\n]+)/);
        
        // Remove tracking info from notes display (works without 's' flag)
        let cleanNotes = notes;
        if (trackingMatch) {
          // Remove from the tracking number onwards
          const trackingIndex = notes.indexOf('Tracking Number:');
          if (trackingIndex !== -1) {
            cleanNotes = notes.substring(0, trackingIndex).trim();
          }
        }
        
        setStatusUpdate({
          status: data.data.status,
          payment_status: data.data.payment_status,
          notes: cleanNotes,
          tracking_number: trackingMatch ? trackingMatch[1].trim() : '',
          tracking_url: trackingUrlMatch ? trackingUrlMatch[1].trim() : '',
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

  useEffect(() => {
    if (orderId && isAdmin) {
      fetchOrder();
    }
  }, [orderId, isAdmin]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    setUpdating(true);

    try {
      const decodedId = decodeURIComponent(orderId as string);
      
      // Prepare update payload
      const updatePayload: any = {
        ...statusUpdate,
      };

      // Set shipped_at timestamp when status changes to "shipped"
      if (statusUpdate.status === 'shipped' && order?.status !== 'shipped') {
        updatePayload.shipped_at = new Date().toISOString();
      }

      // Set delivered_at timestamp when status changes to "delivered"
      if (statusUpdate.status === 'delivered' && order?.status !== 'delivered') {
        updatePayload.delivered_at = new Date().toISOString();
      }

      const response = await fetch(`/api/admin/orders/${encodeURIComponent(decodedId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();
      if (data.success) {
        await fetchOrder();
        const message = data.emailSent 
          ? 'Order updated successfully! Customer notification email has been sent.'
          : 'Order updated successfully!';
        alert(message);
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

  const handleSendReviewRequest = async () => {
    if (!orderId || !order) return;
    
    if (!confirm('Send a review request email to the customer?')) {
      return;
    }

    setSendingReviewRequest(true);

    try {
      const decodedId = decodeURIComponent(orderId as string);
      
      const response = await fetch('/api/admin/orders/send-review-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: decodedId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Review request email sent successfully!');
      } else {
        alert(data.message || 'Error sending review request email');
      }
    } catch (error) {
      console.error('Error sending review request:', error);
      alert('Error sending review request email');
    } finally {
      setSendingReviewRequest(false);
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

                  {(statusUpdate.status === 'shipped' || statusUpdate.status === 'delivered') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tracking Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={statusUpdate.tracking_number}
                          onChange={(e) => setStatusUpdate({ ...statusUpdate, tracking_number: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coffee focus:ring-coffee"
                          placeholder="e.g., 1Z999AA10123456784"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          This will be included in the shipping notification email to the customer.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tracking URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={statusUpdate.tracking_url}
                          onChange={(e) => setStatusUpdate({ ...statusUpdate, tracking_url: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coffee focus:ring-coffee"
                          placeholder="https://tracking.carrier.com/..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Link to track the package (e.g., USPS, UPS, FedEx tracking page).
                        </p>
                      </div>
                    </>
                  )}

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

              {/* Send Review Request Button */}
              {order.status === 'delivered' && order.customer_email && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-coffee-dark mb-4">Review Request</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Send a review request email to the customer to encourage them to leave feedback on their purchased products.
                  </p>
                  <button
                    onClick={handleSendReviewRequest}
                    disabled={sendingReviewRequest}
                    className="w-full bg-coffee-light hover:bg-coffee text-cream-light py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {sendingReviewRequest ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Send Review Request Email
                      </>
                    )}
                  </button>
                </div>
              )}

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

